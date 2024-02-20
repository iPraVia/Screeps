export class TowerControll {

    private tower:StructureTower;
    private modeBattle:boolean | undefined;

    constructor(tower:StructureTower){
        this.modeBattle = Game.spawns['Spawn1'].memory.modeBattle;
        this.tower = tower;
    }

    public run(){this.actionsTower()}

    private actionsTower():void{
        if(this.modeBattle){this.seekAndDestroy()}
        else{this.seekAndRepair()}
    }

    private seekAndRepair():void{
        const structureDamage = this.tower.pos.findClosestByPath(FIND_STRUCTURES ,{
            filter: (structure:AnyStructure) => {
                return (
                    structure.structureType != STRUCTURE_WALL
                )&& structure.hits < structure.hitsMax
            }
        });

        if(structureDamage){this.tower.repair(structureDamage)}
    }

    private seekAndDestroy():void{
        const enemyTarget = this.tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(enemyTarget){this.tower.attack(enemyTarget)}
    }

}
