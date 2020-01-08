"use strict";
const BleAttributeAbstract = require('./bleAttributeAbstract');
class BleRemoteAttributeAbstract extends BleAttributeAbstract {
    constructor(params) {
        super(params);
        this.isRemote = false;
        this.discoverdOnRemote = false;
    }
    get wsChildUuidName() {
        let childrenName = this.childrenName;
        if (!childrenName) {
            return null;
        }
        let childName = childrenName.slice(0, -1);
        return childName + '_uuid';
    }
    discoverChildren() { }
    discoverChildrenWait() {
        return new Promise(resolve => {
            this.emitter.once('discoverfinished', () => {
                let children = this.children.filter(elm => {
                    return elm.discoverdOnRemote;
                });
                resolve(children);
            });
            this.discoverChildren();
        });
    }
    /**
     * CALLBACKS
     */
    ondiscover() { }
    ondiscoverfinished() { }
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        switch (notifyName) {
            case 'discover': {
                let uuid = params[this.wsChildUuidName];
                let child = this.getChild(uuid);
                if (!child) {
                    child = this.addChild({ uuid });
                }
                child.discoverdOnRemote = true;
                child.properties = params.properties || [];
                this.ondiscover(child);
                break;
            }
            case 'discoverfinished': {
                let children = this.children.filter(elm => {
                    return elm.discoverdOnRemote;
                });
                this.ondiscoverfinished(children);
                break;
            }
        }
    }
}
module.exports = BleRemoteAttributeAbstract;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFFL0QsTUFBTSwwQkFBMkIsU0FBUSxvQkFBb0I7SUFDM0QsWUFBWSxNQUFNO1FBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVkLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsT0FBTyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzdCLENBQUM7SUFFRCxnQkFBZ0IsS0FBSSxDQUFDO0lBRXJCLG9CQUFvQjtRQUNsQixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtnQkFDekMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3hDLE9BQU8sR0FBRyxDQUFDLGlCQUFpQixDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILFVBQVUsS0FBSSxDQUFDO0lBRWYsa0JBQWtCLEtBQUksQ0FBQztJQUV2QixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsTUFBTTtRQUNqQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLFFBQVEsVUFBVSxFQUFFO1lBQ2xCLEtBQUssVUFBVSxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDVixLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ2pDO2dCQUNELEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU07YUFDUDtZQUNELEtBQUssa0JBQWtCLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3hDLE9BQU8sR0FBRyxDQUFDLGlCQUFpQixDQUFDO2dCQUMvQixDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xDLE1BQU07YUFDUDtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRywwQkFBMEIsQ0FBQyIsImZpbGUiOiJvYm5pei9saWJzL2VtYmVkcy9ibGUvYmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCbGVBdHRyaWJ1dGVBYnN0cmFjdCA9IHJlcXVpcmUoJy4vYmxlQXR0cmlidXRlQWJzdHJhY3QnKTtcblxuY2xhc3MgQmxlUmVtb3RlQXR0cmlidXRlQWJzdHJhY3QgZXh0ZW5kcyBCbGVBdHRyaWJ1dGVBYnN0cmFjdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHN1cGVyKHBhcmFtcyk7XG5cbiAgICB0aGlzLmlzUmVtb3RlID0gZmFsc2U7XG4gICAgdGhpcy5kaXNjb3ZlcmRPblJlbW90ZSA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IHdzQ2hpbGRVdWlkTmFtZSgpIHtcbiAgICBsZXQgY2hpbGRyZW5OYW1lID0gdGhpcy5jaGlsZHJlbk5hbWU7XG4gICAgaWYgKCFjaGlsZHJlbk5hbWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgY2hpbGROYW1lID0gY2hpbGRyZW5OYW1lLnNsaWNlKDAsIC0xKTtcbiAgICByZXR1cm4gY2hpbGROYW1lICsgJ191dWlkJztcbiAgfVxuXG4gIGRpc2NvdmVyQ2hpbGRyZW4oKSB7fVxuXG4gIGRpc2NvdmVyQ2hpbGRyZW5XYWl0KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKCdkaXNjb3ZlcmZpbmlzaGVkJywgKCkgPT4ge1xuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLmZpbHRlcihlbG0gPT4ge1xuICAgICAgICAgIHJldHVybiBlbG0uZGlzY292ZXJkT25SZW1vdGU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKGNoaWxkcmVuKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXNjb3ZlckNoaWxkcmVuKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ0FMTEJBQ0tTXG4gICAqL1xuICBvbmRpc2NvdmVyKCkge31cblxuICBvbmRpc2NvdmVyZmluaXNoZWQoKSB7fVxuXG4gIG5vdGlmeUZyb21TZXJ2ZXIobm90aWZ5TmFtZSwgcGFyYW1zKSB7XG4gICAgc3VwZXIubm90aWZ5RnJvbVNlcnZlcihub3RpZnlOYW1lLCBwYXJhbXMpO1xuICAgIHN3aXRjaCAobm90aWZ5TmFtZSkge1xuICAgICAgY2FzZSAnZGlzY292ZXInOiB7XG4gICAgICAgIGxldCB1dWlkID0gcGFyYW1zW3RoaXMud3NDaGlsZFV1aWROYW1lXTtcbiAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZCh1dWlkKTtcbiAgICAgICAgaWYgKCFjaGlsZCkge1xuICAgICAgICAgIGNoaWxkID0gdGhpcy5hZGRDaGlsZCh7IHV1aWQgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGQuZGlzY292ZXJkT25SZW1vdGUgPSB0cnVlO1xuICAgICAgICBjaGlsZC5wcm9wZXJ0aWVzID0gcGFyYW1zLnByb3BlcnRpZXMgfHwgW107XG4gICAgICAgIHRoaXMub25kaXNjb3ZlcihjaGlsZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnZGlzY292ZXJmaW5pc2hlZCc6IHtcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5maWx0ZXIoZWxtID0+IHtcbiAgICAgICAgICByZXR1cm4gZWxtLmRpc2NvdmVyZE9uUmVtb3RlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbmRpc2NvdmVyZmluaXNoZWQoY2hpbGRyZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbGVSZW1vdGVBdHRyaWJ1dGVBYnN0cmFjdDtcbiJdfQ==
