import { roleRepairer } from "./Repairer";

export class roleHarvester {

    private creep:Creep;

    private tombstone?:Tombstone | null;
    private ruin?:Ruin | null;
    private source?:Source | null;
    private linkTo?:StructureLink | null;

    private modeBattle:boolean | undefined;

    constructor(creep:Creep){
        this.creep = creep;
        this.modeBattle = Game.spawns['Spawn1'].memory.modeBattle;
    }

    public run(){
        if(!this.creep.memory.harvester && this.creep.store[RESOURCE_ENERGY] == 0){
            this.creep.memory.harvester = true;
        }else if(this.creep.memory.harvester && this.creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            this.creep.memory.harvester = false;
        }

        if(this.creep.memory.harvester){
            this.findEnergy();
        }else{
            if(this.modeBattle){this.actionModeBattle()}
            else{this.findStructures()}
        }
    }

    private findEnergy(){

        this.tombstone = this.creep.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter:(tomb:Tombstone) => {return tomb.store[RESOURCE_ENERGY] > 0 }
        })

        if(this.tombstone){
            if(this.creep.withdraw(this.tombstone,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(this.tombstone);
            }
        }else{
            this.linkTo = this.findLinkTo();
            if(this.linkTo){
                if(this.creep.withdraw(this.linkTo,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    this.creep.moveTo(this.linkTo);
                }
            }else{
                this.ruin = this.creep.pos.findClosestByPath(FIND_RUINS, {
                    filter:(ruin:Ruin) => {return ruin.store[RESOURCE_ENERGY] > 0 }
                })
                if(this.ruin){
                    if(this.creep.withdraw(this.ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        this.creep.moveTo(this.ruin);
                    }
                }else{
                    this.source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
                    if(this.source){
                        if(this.creep.harvest(this.source) == ERR_NOT_IN_RANGE){
                            this.creep.moveTo(this.source);
                        }
                    }
                }
            }
        }
    }

    private findLinkTo():StructureLink | null {
        const linkTo:StructureLink | null = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure:AnyStructure) => {
                return (
                    structure.structureType == STRUCTURE_LINK
                )&& structure.store[RESOURCE_ENERGY] != 0
            }
        });
        if(linkTo){
            const tower:StructureTower | null = linkTo.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure:AnyStructure) => {
                    return structure.structureType == STRUCTURE_TOWER
                }
            });
            if(tower){return linkTo}
            else{
                const otherLink:StructureLink | null = this.creep.pos.findClosestByPath(FIND_STRUCTURES,{
                    filter: (structure:AnyStructure) => {
                        return (
                            structure.structureType == STRUCTURE_LINK
                        )&& structure != linkTo
                    }
                });
                if(otherLink){return otherLink}
            }
        }
        return null
    }

    private findStructures(){
        const principalTarget:AnyStructure | null = this.findPrimaryStructure();

        if(principalTarget){
            if(this.creep.transfer(principalTarget,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(principalTarget);
            }
        }else{
            const secondTarget:AnyStructure | null = this.findSecondStructure();
            if(secondTarget){
                if(this.creep.transfer(secondTarget,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    this.creep.moveTo(secondTarget)
                }
            }else{new roleRepairer(this.creep).run()}
        }
    }

    private findPrimaryStructure():AnyStructure | null{
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES,{
            filter: (structure:AnyStructure) => {
                return (
                    (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN
                    ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) != 0
                )
            }
        });
    }

    private findSecondStructure():AnyStructure | null {
        return this.creep.pos.findClosestByPath(FIND_STRUCTURES,{
            filter: (structure:AnyStructure) => {
                return (
                    (
                        (
                            structure.structureType == STRUCTURE_TOWER &&
                            structure.store[RESOURCE_ENERGY] <= structure.store.getCapacity(RESOURCE_ENERGY) / 2
                        )
                        ||
                        (
                            (
                                (
                                    structure.structureType == STRUCTURE_CONTAINER &&
                                    this.creep.memory.role != 'builder'
                                )||
                                structure.structureType == STRUCTURE_STORAGE
                            )&& structure.store.getFreeCapacity(RESOURCE_ENERGY) != 0
                        )
                    )
                )
            }
        });
    }

    private actionModeBattle():void{
        const tower = this.creep.pos.findClosestByPath(FIND_STRUCTURES,{
            filter: (structure:AnyStructure) => {
                return (
                    structure.structureType == STRUCTURE_TOWER
                )&& structure.store.getFreeCapacity(RESOURCE_ENERGY) != 0
            }
        })
        if(tower){
            if(this.creep.transfer(tower,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                this.creep.moveTo(tower);
            }
        }
    }

}
