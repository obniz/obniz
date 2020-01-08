"use strict";
class PeripheralIO {
    constructor(Obniz, id) {
        this.Obniz = Obniz;
        this.id = id;
        this._reset();
    }
    _reset() {
        this.value = 0;
        this.observers = [];
    }
    addObserver(callback) {
        if (callback) {
            this.observers.push(callback);
        }
    }
    output(value) {
        value = value == true;
        let obj = {};
        obj['io' + this.id] = value;
        this.value = value;
        this.Obniz.send(obj);
    }
    drive(drive) {
        if (typeof drive !== 'string') {
            throw new Error('please specify drive methods in string');
        }
        let output_type = '';
        switch (drive) {
            case '5v':
                output_type = 'push-pull5v';
                break;
            case '3v':
                output_type = 'push-pull3v';
                break;
            case 'open-drain':
                output_type = 'open-drain';
                break;
            default:
                throw new Error('unknown drive method');
        }
        let obj = {};
        obj['io' + this.id] = {
            output_type: output_type,
        };
        this.Obniz.send(obj);
    }
    pull(updown) {
        if (typeof updown !== 'string' && updown !== null) {
            throw new Error('please specify pull methods in string');
        }
        let pull_type = '';
        switch (updown) {
            case '5v':
            case 'pull-up5v':
                pull_type = 'pull-up5v';
                break;
            case '3v':
            case 'pull-up3v':
                pull_type = 'pull-up3v';
                break;
            case '0v':
            case 'pull-down':
                pull_type = 'pull-down';
                break;
            case null:
            case 'float':
                pull_type = 'float';
                break;
            default:
                throw new Error('unknown pull_type method');
        }
        let obj = {};
        obj['io' + this.id] = {
            pull_type: pull_type,
        };
        this.Obniz.send(obj);
    }
    input(callback) {
        this.onchange = callback;
        let obj = {};
        obj['io' + this.id] = {
            direction: 'input',
            stream: true,
        };
        this.Obniz.send(obj);
        return this.value;
    }
    inputWait() {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.addObserver(resolve);
            let obj = {};
            obj['io' + self.id] = {
                direction: 'input',
                stream: false,
            };
            self.Obniz.send(obj);
        });
    }
    end() {
        let obj = {};
        obj['io' + this.id] = null;
        this.Obniz.send(obj);
    }
    notified(obj) {
        if (typeof obj === 'boolean') {
            this.value = obj;
            let callback = this.observers.shift();
            if (callback) {
                callback(obj);
            }
            if (typeof this.onchange === 'function') {
                this.onchange(obj);
            }
        }
        else if (obj && typeof obj === 'object') {
            if (obj.warning) {
                this.Obniz.warning({
                    alert: 'warning',
                    message: `io${this.id}: ${obj.warning.message}`,
                });
            }
            if (obj.error) {
                this.Obniz.error({
                    alert: 'error',
                    message: `io${this.id}: ${obj.error.message}`,
                });
            }
        }
    }
}
module.exports = PeripheralIO;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2lvX3BlcmlwaGVyYWxzL2lvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLFlBQVk7SUFDaEIsWUFBWSxLQUFLLEVBQUUsRUFBRTtRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFRO1FBQ2xCLElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUs7UUFDVixLQUFLLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQztRQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxJQUFJO2dCQUNQLFdBQVcsR0FBRyxhQUFhLENBQUM7Z0JBQzVCLE1BQU07WUFDUixL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LENBQUM7SUFFRCxRQUFRLENBQUMsR0FBRztRQUNWLElBQUksT0FBTyxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEMsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7WUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEI7U0FDRjthQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7b0JBQ2pCLEtBQUssRUFBRSxTQUFTO29CQUNoQixPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2lCQUNoRCxDQUFDLENBQUM7YUFDSjtZQUNELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFDYixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDZixLQUFLLEVBQUUsT0FBTztvQkFDZCxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO2lCQUM5QyxDQUFDLENBQUM7YUFDSjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoib2JuaXovbGlicy9pb19wZXJpcGhlcmFscy9pby5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFBlcmlwaGVyYWxJTyB7XG4gIGNvbnN0cnVjdG9yKE9ibml6LCBpZCkge1xuICAgIHRoaXMuT2JuaXogPSBPYm5pejtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgfVxuXG4gIF9yZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gMDtcbiAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xuICB9XG5cbiAgYWRkT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIG91dHB1dCh2YWx1ZSkge1xuICAgIHZhbHVlID0gdmFsdWUgPT0gdHJ1ZTtcbiAgICBsZXQgb2JqID0ge307XG4gICAgb2JqWydpbycgKyB0aGlzLmlkXSA9IHZhbHVlO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIGRyaXZlKGRyaXZlKSB7XG4gICAgaWYgKHR5cGVvZiBkcml2ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncGxlYXNlIHNwZWNpZnkgZHJpdmUgbWV0aG9kcyBpbiBzdHJpbmcnKTtcbiAgICB9XG4gICAgbGV0IG91dHB1dF90eXBlID0gJyc7XG4gICAgc3dpdGNoIChkcml2ZSkge1xuICAgICAgY2FzZSAnNXYnOlxuICAgICAgICBvdXRwdXRfdHlwZSA9ICdwdXNoLXB1bGw1dic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnM3YnOlxuICAgICAgICBvdXRwdXRfdHlwZSA9ICdwdXNoLXB1bGwzdic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb3Blbi1kcmFpbic6XG4gICAgICAgIG91dHB1dF90eXBlID0gJ29wZW4tZHJhaW4nO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBkcml2ZSBtZXRob2QnKTtcbiAgICB9XG5cbiAgICBsZXQgb2JqID0ge307XG4gICAgb2JqWydpbycgKyB0aGlzLmlkXSA9IHtcbiAgICAgIG91dHB1dF90eXBlOiBvdXRwdXRfdHlwZSxcbiAgICB9O1xuICAgIHRoaXMuT2JuaXouc2VuZChvYmopO1xuICB9XG5cbiAgcHVsbCh1cGRvd24pIHtcbiAgICBpZiAodHlwZW9mIHVwZG93biAhPT0gJ3N0cmluZycgJiYgdXBkb3duICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsZWFzZSBzcGVjaWZ5IHB1bGwgbWV0aG9kcyBpbiBzdHJpbmcnKTtcbiAgICB9XG4gICAgbGV0IHB1bGxfdHlwZSA9ICcnO1xuICAgIHN3aXRjaCAodXBkb3duKSB7XG4gICAgICBjYXNlICc1dic6XG4gICAgICBjYXNlICdwdWxsLXVwNXYnOlxuICAgICAgICBwdWxsX3R5cGUgPSAncHVsbC11cDV2JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICczdic6XG4gICAgICBjYXNlICdwdWxsLXVwM3YnOlxuICAgICAgICBwdWxsX3R5cGUgPSAncHVsbC11cDN2JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICcwdic6XG4gICAgICBjYXNlICdwdWxsLWRvd24nOlxuICAgICAgICBwdWxsX3R5cGUgPSAncHVsbC1kb3duJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG51bGw6XG4gICAgICBjYXNlICdmbG9hdCc6XG4gICAgICAgIHB1bGxfdHlwZSA9ICdmbG9hdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIHB1bGxfdHlwZSBtZXRob2QnKTtcbiAgICB9XG5cbiAgICBsZXQgb2JqID0ge307XG4gICAgb2JqWydpbycgKyB0aGlzLmlkXSA9IHtcbiAgICAgIHB1bGxfdHlwZTogcHVsbF90eXBlLFxuICAgIH07XG4gICAgdGhpcy5PYm5pei5zZW5kKG9iaik7XG4gIH1cblxuICBpbnB1dChjYWxsYmFjaykge1xuICAgIHRoaXMub25jaGFuZ2UgPSBjYWxsYmFjaztcbiAgICBsZXQgb2JqID0ge307XG4gICAgb2JqWydpbycgKyB0aGlzLmlkXSA9IHtcbiAgICAgIGRpcmVjdGlvbjogJ2lucHV0JyxcbiAgICAgIHN0cmVhbTogdHJ1ZSxcbiAgICB9O1xuICAgIHRoaXMuT2JuaXouc2VuZChvYmopO1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgaW5wdXRXYWl0KCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzZWxmLmFkZE9ic2VydmVyKHJlc29sdmUpO1xuICAgICAgbGV0IG9iaiA9IHt9O1xuICAgICAgb2JqWydpbycgKyBzZWxmLmlkXSA9IHtcbiAgICAgICAgZGlyZWN0aW9uOiAnaW5wdXQnLFxuICAgICAgICBzdHJlYW06IGZhbHNlLFxuICAgICAgfTtcbiAgICAgIHNlbGYuT2JuaXouc2VuZChvYmopO1xuICAgIH0pO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBvYmpbJ2lvJyArIHRoaXMuaWRdID0gbnVsbDtcbiAgICB0aGlzLk9ibml6LnNlbmQob2JqKTtcbiAgfVxuXG4gIG5vdGlmaWVkKG9iaikge1xuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBvYmo7XG4gICAgICBsZXQgY2FsbGJhY2sgPSB0aGlzLm9ic2VydmVycy5zaGlmdCgpO1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iaik7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRoaXMub25jaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5vbmNoYW5nZShvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAob2JqLndhcm5pbmcpIHtcbiAgICAgICAgdGhpcy5PYm5pei53YXJuaW5nKHtcbiAgICAgICAgICBhbGVydDogJ3dhcm5pbmcnLFxuICAgICAgICAgIG1lc3NhZ2U6IGBpbyR7dGhpcy5pZH06ICR7b2JqLndhcm5pbmcubWVzc2FnZX1gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmouZXJyb3IpIHtcbiAgICAgICAgdGhpcy5PYm5pei5lcnJvcih7XG4gICAgICAgICAgYWxlcnQ6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogYGlvJHt0aGlzLmlkfTogJHtvYmouZXJyb3IubWVzc2FnZX1gLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQZXJpcGhlcmFsSU87XG4iXX0=
