"use strict";
class ObnizBLEHci {
    constructor(Obniz) {
        this.Obniz = Obniz;
    }
    write(hciCommand) {
        this.Obniz.send({
            ble: {
                hci: {
                    write: hciCommand,
                },
            },
        });
    }
    notified(obj) {
        if (obj.read && obj.read.data) {
            this.onread(obj.read.data);
        }
    }
    onread() { }
}
module.exports = ObnizBLEHci;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvaGNpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLFdBQVc7SUFDZixZQUFZLEtBQUs7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNkLEdBQUcsRUFBRTtnQkFDSCxHQUFHLEVBQUU7b0JBQ0gsS0FBSyxFQUFFLFVBQVU7aUJBQ2xCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQUc7UUFDVixJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVELE1BQU0sS0FBSSxDQUFDO0NBQ1o7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL2VtYmVkcy9ibGVIY2kvaGNpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgT2JuaXpCTEVIY2kge1xuICBjb25zdHJ1Y3RvcihPYm5peikge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgfVxuXG4gIHdyaXRlKGhjaUNvbW1hbmQpIHtcbiAgICB0aGlzLk9ibml6LnNlbmQoe1xuICAgICAgYmxlOiB7XG4gICAgICAgIGhjaToge1xuICAgICAgICAgIHdyaXRlOiBoY2lDb21tYW5kLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIG5vdGlmaWVkKG9iaikge1xuICAgIGlmIChvYmoucmVhZCAmJiBvYmoucmVhZC5kYXRhKSB7XG4gICAgICB0aGlzLm9ucmVhZChvYmoucmVhZC5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBvbnJlYWQoKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9ibml6QkxFSGNpO1xuIl19
