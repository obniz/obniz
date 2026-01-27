local gps_state = {
    latitude = nil,
    longitude = nil,
    altitude = nil,
    speed = nil,
    course = nil,
    time = nil,
    date = nil,
    fix_quality = 0,
    satellites_used = 0,
    hdop = nil,
    is_valid = false
}

local nmea_buffer = ""

local function convert_dms_to_dd(dms, direction)
    if not dms or #dms < 4 then
        return nil
    end

    local degrees = tonumber(string.sub(dms, 1, #dms - 7))
    local minutes = tonumber(string.sub(dms, #dms - 6))

    if not degrees or not minutes then
        return nil
    end

    local dd = degrees + (minutes / 60)

    if direction == "S" or direction == "W" then
        dd = -dd
    end

    return dd
end

local function parse_gga(parts)
    if #parts < 15 then
        return nil
    end

    local time = parts[2]
    local lat = parts[3]
    local lat_dir = parts[4]
    local lon = parts[5]
    local lon_dir = parts[6]
    local quality = tonumber(parts[7]) or 0
    local satellites = tonumber(parts[8]) or 0
    local hdop = tonumber(parts[9])
    local altitude = tonumber(parts[10])

    local latitude = nil
    local longitude = nil

    if lat and #lat > 0 then
        latitude = convert_dms_to_dd(lat, lat_dir)
    end

    if lon and #lon > 0 then
        longitude = convert_dms_to_dd(lon, lon_dir)
    end

    return {
        type = "GGA",
        time = time,
        latitude = latitude,
        longitude = longitude,
        altitude = altitude,
        fix_quality = quality,
        satellites_used = satellites,
        hdop = hdop,
        is_valid = quality > 0
    }
end

local function parse_rmc(parts)
    if #parts < 12 then
        return nil
    end

    local time = parts[2]
    local status = parts[3]
    local lat = parts[4]
    local lat_dir = parts[5]
    local lon = parts[6]
    local lon_dir = parts[7]
    local speed = tonumber(parts[8])
    local course = tonumber(parts[9])
    local date = parts[10]

    local latitude = nil
    local longitude = nil

    if lat and #lat > 0 then
        latitude = convert_dms_to_dd(lat, lat_dir)
    end

    if lon and #lon > 0 then
        longitude = convert_dms_to_dd(lon, lon_dir)
    end

    return {
        type = "RMC",
        time = time,
        date = date,
        latitude = latitude,
        longitude = longitude,
        speed = speed,
        course = course,
        is_valid = status == "A"
    }
end

local function parse_vtg(parts)
    if #parts < 9 then
        return nil
    end

    local course = tonumber(parts[2])
    local speed_knots = tonumber(parts[6])
    local speed_kmh = tonumber(parts[8])

    return {
        type = "VTG",
        course = course,
        speed_knots = speed_knots,
        speed_kmh = speed_kmh
    }
end

local function split_string(str, delimiter)
    local result = {}
    local from = 1
    local delim_start, delim_end = string.find(str, delimiter, from, true)

    while delim_start do
        table.insert(result, string.sub(str, from, delim_start - 1))
        from = delim_end + 1
        delim_start, delim_end = string.find(str, delimiter, from, true)
    end

    -- Add the last part
    table.insert(result, string.sub(str, from))

    return result
end

-- Parse NMEA sentence
local function parse_nmea(sentence)
    if not string.match(sentence, "^%$") or not string.match(sentence, "%*") then
        return nil
    end

    local parts = split_string(sentence, ",")
    local message_type = parts[1]

    if message_type == "$GNGGA" or message_type == "$GPGGA" or message_type == "$GLGGA" or message_type == "$GAGGA" then
        return parse_gga(parts)
    elseif message_type == "$GNRMC" or message_type == "$GPRMC" or message_type == "$GLRMC" or message_type == "$GARMC" then
        return parse_rmc(parts)
    elseif message_type == "$GNVTG" or message_type == "$GPVTG" or message_type == "$GLVTG" or message_type == "$GAVTG" then
        return parse_vtg(parts)
    else
        return nil, message_type
    end
end

local function update_gps_state(data)
    if not data then
        return
    end

    if data.type == "GGA" then
        if data.latitude then
            gps_state.latitude = data.latitude
        end
        if data.longitude then
            gps_state.longitude = data.longitude
        end
        if data.altitude then
            gps_state.altitude = data.altitude
        end
        gps_state.fix_quality = data.fix_quality
        gps_state.satellites_used = data.satellites_used
        gps_state.hdop = data.hdop
        if data.time then
            gps_state.time = data.time
        end
    elseif data.type == "RMC" then
        if data.latitude then
            gps_state.latitude = data.latitude
        end
        if data.longitude then
            gps_state.longitude = data.longitude
        end
        if data.speed then
            gps_state.speed = data.speed
        end
        if data.course then
            gps_state.course = data.course
        end
        if data.time then
            gps_state.time = data.time
        end
        if data.date then
            gps_state.date = data.date
        end
        gps_state.is_valid = data.is_valid
    elseif data.type == "VTG" then
        if data.speed_kmh then
            gps_state.speed = data.speed_kmh
        end
        if data.course then
            gps_state.course = data.course
        end
    end
end

-- Display GPS status
local function display_gps_status()
    os.log("=== GPS Status ===")
    cloud.pluginSend("=== GPS Status ===")

    if gps_state.latitude and gps_state.longitude then
        os.log("Latitude: " .. string.format("%.6f", gps_state.latitude))
        cloud.pluginSend("Latitude: " .. string.format("%.6f", gps_state.latitude))
        os.log("Longitude: " .. string.format("%.6f", gps_state.longitude))
        cloud.pluginSend("Longitude: " .. string.format("%.6f", gps_state.longitude))

        if gps_state.altitude then
            os.log("Altitude: " .. string.format("%.1f", gps_state.altitude) .. "m")
            cloud.pluginSend("Altitude: " .. string.format("%.1f", gps_state.altitude) .. "m")
        end

        os.log("Satellites: " .. gps_state.satellites_used)
        os.log("Fix Quality: " .. gps_state.fix_quality)
        cloud.pluginSend("Satellites: " .. gps_state.satellites_used)
        cloud.pluginSend("Fix Quality: " .. gps_state.fix_quality)

        if gps_state.hdop then
            os.log("HDOP: " .. string.format("%.2f", gps_state.hdop))
            cloud.pluginSend("HDOP: " .. string.format("%.2f", gps_state.hdop))
        end

        if gps_state.speed then
            os.log("Speed: " .. string.format("%.1f", gps_state.speed) .. " km/h")
            cloud.pluginSend("Speed: " .. string.format("%.1f", gps_state.speed) .. " km/h")
        end

        if gps_state.course then
            os.log("Course: " .. string.format("%.1f", gps_state.course))
            cloud.pluginSend("Course: " .. string.format("%.1f", gps_state.course))
        end
    else
        os.log("GPS signal not received")
        os.log("Satellites: " .. gps_state.satellites_used)
        cloud.pluginSend("GPS signal not received")
        cloud.pluginSend("Satellites: " .. gps_state.satellites_used)
    end

    os.log("==================")
    cloud.pluginSend("==================")
end

-- Event handler
function on_event(event)
    if event == "power_on" then
        os.log("GPS Module Initialized")
        cloud.pluginSend("GPS Module Initialized")
        uart.start(1, 0, 9600)  -- tx:io1 rx:io0 baud:9600
    end
end

local loop_counter = 0

function on_offline_loop()
    loop()
end

function on_online_loop()
    loop()
end

function loop()
    local data = uart.recv()

    if #data > 0 then
        nmea_buffer = nmea_buffer .. data

        while string.find(nmea_buffer, "\n") do
            local newline_pos = string.find(nmea_buffer, "\n")
            local line = string.sub(nmea_buffer, 1, newline_pos - 1)
            nmea_buffer = string.sub(nmea_buffer, newline_pos + 1)

            line = string.gsub(line, "\r", "")
            line = string.gsub(line, "^%s*(.-)%s*$", "%1")  -- trim

            if #line > 0 then
                local parsed_data = parse_nmea(line)
                if parsed_data then
                    update_gps_state(parsed_data)
                end
            end
        end
    end

    loop_counter = loop_counter + 1
    if loop_counter >= 5000 then
        display_gps_status()
        loop_counter = 0
    end
end
