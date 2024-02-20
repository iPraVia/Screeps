export class roleUpgrader {

    private creep:Creep;

    constructor(creep:Creep){
        this.creep = creep;
    }

    public run():void{this.start()}

    private start():void{
        if(this.creep.memory.upgrader && this.creep.store[RESOURCE_ENERGY] == 0){
            this.creep.memory.upgrader = false;
            this.creep.say('HARVESTER');
        }
        if(!this.creep.memory.upgrader && this.creep.store.getFreeCapacity() == 0){
            this.creep.memory.upgrader = true;
            this.creep.say('Upgrader');
        }
        if(!this.creep.memory.upgrader){this.findEnergy()}
        else{this.updateRoomController()}
    }

    private findEnergy():void{
        const source:Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        const storage:StructureStorage | null = this.creep.pos.findClosestByPath(FIND_STRUCTURES,{
            filter: (structure:AnyStructure) => {
                return (
                    structure.structureType == STRUCTURE_STORAGE
                )&& structure.store[RESOURCE_ENERGY] > 0
            }
        });

        if(storage){
            if(this.creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(storage);
            }
        }else if(source){
            if(this.creep.harvest(source) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(source);
            }
        }
    }

    private updateRoomController(){
        if(this.creep.room.controller){
            if(this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(this.creep.room.controller);
            }
        }
    }
}
