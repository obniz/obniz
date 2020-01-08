"use strict";
module.exports = class HW {
    constructor() { }
    static getDefinitionFor(hw) {
        if (hw === 'obnizb1') {
            return require('./obnizb1.json');
        }
        else if (hw === 'obnizb2') {
            return require('./obnizb2.json');
        }
        else if (hw === 'esp32w') {
            return require('./esp32w.json');
        }
        else if (hw === 'esp32p') {
            return require('./esp32p.json');
        }
        else if (hw === 'encored') {
            return require('./encored.json');
        }
        return undefined;
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2h3L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sRUFBRTtJQUN2QixnQkFBZSxDQUFDO0lBRWhCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1FBQ3hCLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtZQUNwQixPQUFPLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2xDO2FBQU0sSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQzNCLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDbEM7YUFBTSxJQUFJLEVBQUUsS0FBSyxRQUFRLEVBQUU7WUFDMUIsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDakM7YUFBTSxJQUFJLEVBQUUsS0FBSyxRQUFRLEVBQUU7WUFDMUIsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDakM7YUFBTSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7WUFDM0IsT0FBTyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNsQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FDRixDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvaHcvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhXIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHN0YXRpYyBnZXREZWZpbml0aW9uRm9yKGh3KSB7XG4gICAgaWYgKGh3ID09PSAnb2JuaXpiMScpIHtcbiAgICAgIHJldHVybiByZXF1aXJlKCcuL29ibml6YjEuanNvbicpO1xuICAgIH0gZWxzZSBpZiAoaHcgPT09ICdvYm5pemIyJykge1xuICAgICAgcmV0dXJuIHJlcXVpcmUoJy4vb2JuaXpiMi5qc29uJyk7XG4gICAgfSBlbHNlIGlmIChodyA9PT0gJ2VzcDMydycpIHtcbiAgICAgIHJldHVybiByZXF1aXJlKCcuL2VzcDMydy5qc29uJyk7XG4gICAgfSBlbHNlIGlmIChodyA9PT0gJ2VzcDMycCcpIHtcbiAgICAgIHJldHVybiByZXF1aXJlKCcuL2VzcDMycC5qc29uJyk7XG4gICAgfSBlbHNlIGlmIChodyA9PT0gJ2VuY29yZWQnKSB7XG4gICAgICByZXR1cm4gcmVxdWlyZSgnLi9lbmNvcmVkLmpzb24nKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcbiJdfQ==
