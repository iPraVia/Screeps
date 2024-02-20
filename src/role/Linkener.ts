export class roleLinkener {

    private creep:Creep;
    private source?:Source | null;
    private link?:StructureLink | null;

    constructor(creep:Creep){
        this.creep = creep;
    }

    public run():void{
        this.start();
    }

    private start():void{
        if(this.creep.memory.linkener && this.creep.store[RESOURCE_ENERGY] == 0){
            this.creep.memory.linkener = false;
            this.creep.say('HARVESTER');
        }else if(!this.creep.memory.linkener && this.creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            this.creep.memory.linkener = true;
            this.creep.say('LINKENER');
        }

        if(this.creep.memory.linkener){
            this.findLink();
        }else if(!this.creep.memory.linkener){
            this.findEnergy();
        }
    }

    private findLink():void{
        this.link = this.creep.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: (structure:Structure) => {
                return structure.structureType == STRUCTURE_LINK
            }
        });
        if(this.link){
            if(this.creep.transfer(this.link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(this.link);
            }
        }
    }

    private findEnergy():void{
        this.source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(this.source){
            const linkener:StructureLink | null = this.source.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: (structure:Structure) => {
                    return structure.structureType == STRUCTURE_LINK
                }
            });
            if(linkener){
                if(this.creep.harvest(this.source) == ERR_NOT_IN_RANGE){
                    this.creep.moveTo(this.source);
                }
            }else{
                const otherSource:Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
                    filter: (source:Source) => {
                        return source != this.source
                    }
                });
                if(otherSource){
                    if(this.creep.harvest(this.source) == ERR_NOT_IN_RANGE){
                        this.creep.moveTo(this.source);
                    }
                }
            }
        }
    }

}
