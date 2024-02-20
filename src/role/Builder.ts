import { roleHarvester } from "./Harvester";

export class roleBuilder {

    private creep:Creep;
    private constructionSite?:ConstructionSite | null;

    constructor(creep:Creep){
        this.creep = creep;
    }

    public run():void{

        if(this.creep.memory.builder && this.creep.store[RESOURCE_ENERGY] == 0){
            this.creep.memory.builder = false;
        }
        if(!this.creep.memory.builder && this.creep.store.getFreeCapacity() == 0){
            this.creep.memory.builder = true;
        }

        if(!this.creep.memory.builder){this.findEnergy()}
        else{
            this.constructionSite = this.seekConstructionSite();

            if(this.constructionSite){
                if(this.creep.build(this.constructionSite) == ERR_NOT_IN_RANGE){
                    this.creep.moveTo(this.constructionSite);
                }
            }else{
                const tower:StructureTower | null = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure:AnyStructure) => {
                        return (
                            structure.structureType == STRUCTURE_TOWER
                        )&& structure.store[RESOURCE_ENERGY] <= structure.store.getCapacity(RESOURCE_ENERGY) / 2
                    }
                });
                if(tower){
                    if(this.creep.transfer(tower,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        this.creep.moveTo(tower);
                    }
                }else{new roleHarvester(this.creep).run()}
            }
        }
    }

    private findEnergy():void{
        const container:StructureContainer | null = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure:AnyStructure) => {
                return  (
                        structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store[RESOURCE_ENERGY] > 0
                    )
                }
        });
        if(container){
            if(this.creep.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(container);
            }
        }else{
            const source:Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(source){
                if(this.creep.harvest(source) == ERR_NOT_IN_RANGE){
                    this.creep.moveTo(source);
                }
            }
        }
    }

    private seekConstructionSite():ConstructionSite | null{
        return this.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
    }
}
