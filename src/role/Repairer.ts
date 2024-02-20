import { roleUpgrader } from "./Upgrader";

export class roleRepairer {

    private creep:Creep;

    constructor(creep:Creep){this.creep = creep}

    public run():void{
        if(this.creep.memory.repairer && this.creep.store[RESOURCE_ENERGY] == 0){
            this.creep.memory.repairer = false;
        }
        if(!this.creep.memory.repairer && this.creep.store.getFreeCapacity() == 0){
            this.creep.memory.repairer = true;
        }
        if(!this.creep.memory.repairer){
            this.findEnergy();
        }else{this.seekAndRepairDamageStructures()}
    }

    private findEnergy():void{
        const source:Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(source){
            if(this.creep.harvest(source) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(source);
            }
        }
    }

    private seekAndRepairDamageStructures():void{
        const damageStructure:Structure<StructureConstant>[] = this.creep.room.find(FIND_STRUCTURES,{
            filter: (structure:Structure) => {
                return (structure.hits < structure.hitsMax) &&
                structure.structureType != STRUCTURE_WALL
            }
        });
        if(damageStructure.length){
            const targets:Structure<StructureConstant>[] = damageStructure.sort((sA:Structure,sB:Structure) => {
                return sA.hits - sB.hits;
            });
            if(this.creep.repair(targets[0]) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(targets[0]);
            }
        }else{new roleUpgrader(this.creep).run()}
    }
}
