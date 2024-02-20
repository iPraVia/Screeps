export class roleSoldier {

    private modeBattle:boolean | undefined;
    private creep:Creep;

    constructor(creep:Creep){
        this.modeBattle = Game.spawns['Spawn1'].memory.modeBattle;
        this.creep=creep
    }

    public run():void{
        if(this.modeBattle){this.findHostileCreep()}
        else{this.goToFlag()}
    }

    private goToFlag():void{
        this.creep.moveTo(Game.flags.Flag1);
    }

    private findHostileCreep():void{
        const hostileCreep:Creep | null = this.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(hostileCreep){
            if(this.creep.getActiveBodyparts(ATTACK) != 0){
                this.actionATTACK(hostileCreep)
            }else if(this.creep.getActiveBodyparts(RANGED_ATTACK) != 0){
                this.actionRANGED_ATTACK(hostileCreep);
            }
        }
    }

    private actionRANGED_ATTACK(hostileCreep:Creep):void{
        if(this.creep.rangedAttack(hostileCreep) == ERR_NOT_IN_RANGE){
            this.creep.moveTo(hostileCreep);
        }
    }

    private actionATTACK(hostileCreep:Creep):void{
        if(this.creep.attack(hostileCreep) == ERR_NOT_IN_RANGE){
            this.creep.moveTo(hostileCreep);
        }
    }
}
