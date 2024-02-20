export class roleCreateCreep  {

    private role:string;
    private roomName:string;
    private energyCapacityAvailable:number;

    constructor(role:string,roomName:string){
        this.role = role;
        this.roomName = roomName;
        this.energyCapacityAvailable = Game.rooms[this.roomName].energyCapacityAvailable;
    }

    public create():void{this.validateCreate()}

    private name():string{return `${Game.time}${this.role}`}

    private validateCreate():void{

        if(this.role != ('soldier' || 'linkener')){
            if(this.energyCapacityAvailable >= 300 && this.energyCapacityAvailable < 550){this.createCreepLevelOne()}
            else if(this.energyCapacityAvailable >= 550 && this.energyCapacityAvailable < 800 ){this.createCreepLevelTwo()}
            else if(this.energyCapacityAvailable >= 800 && this.energyCapacityAvailable < 1300){this.createCreepLevelThree()}
            else if(this.energyCapacityAvailable >= 1300){this.createCreepLevelFour()}
        }else if(this.role == 'soldier'){
            if(this.energyCapacityAvailable >= 550 && this.energyCapacityAvailable < 1300){this.createSoldierLevelOne()}
            else if(this.energyCapacityAvailable >= 1300){this.createSoldierLevelTwo()}
        }else if(this.role = 'linkener'){this.createLinkener()}
    }


    static createCreepEmergency():void{
        const name:string = 'harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(
            [
                WORK,WORK,//200
                CARRY,//50
                MOVE//50
            ],
            name,
            {
                memory:{
                    role:'harvester'
                }
            }
        )
    }

    private createCreepLevelOne():void{
        Game.spawns['Spawn1'].spawnCreep(
            [
                WORK,WORK,//200
                CARRY,//50
                MOVE//50
            ],
            this.name(),
            {
                memory:{
                    role:this.role
                }
            }
        )
    }

    private createCreepLevelTwo():void{
        Game.spawns['Spawn1'].spawnCreep(
            [
                WORK,WORK,WORK,WORK,//400
                CARRY,//50
                MOVE,MOVE//100
            ],
            this.name(),
            {
                memory:{
                    role:this.role
                }
            }
        )
    }

    private createCreepLevelThree():void{
        Game.spawns['Spawn1'].spawnCreep(
            [
                WORK,WORK,WORK,WORK,WORK,//500
                CARRY,CARRY,//100
                MOVE,MOVE,MOVE//150
            ],
            this.name(),
            {
                memory:{
                    role:this.role
                }
            }
        )
    }

    private createCreepLevelFour():void{
        Game.spawns['Spawn1'].spawnCreep(
            [
                WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,//900
                CARRY,CARRY,CARRY,CARRY,CARRY,//250
                MOVE,MOVE,MOVE//150
            ],
            this.name(),
            {
                memory:{
                    role:this.role
                }
            }
        )
    }
    private createLinkener():void{
        Game.spawns['Spawn1'].spawnCreep(
            [
                WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,//1100
                CARRY,CARRY,CARRY,CARRY,//200
                MOVE,MOVE//100
            ],
            this.name(),
            {
                memory:{
                    role:this.role
                }
            }
        )
    }

    private createSoldierLevelOne():void{
        Game.spawns['Spawn1'].spawnCreep(
            [
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,//110
                MOVE,MOVE,MOVE,MOVE,//200
                ATTACK,ATTACK,ATTACK//240
            ],
            this.name(),
            {
                memory:{
                    role: this.role
                }
            }
        )
    }

    private createSoldierLevelTwo():void{
        Game.spawns['Spawn1'].spawnCreep(
            [
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,//100
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,//50
                RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,//750
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE//400
            ],
            this.name(),
            {
                memory:{
                    role: this.role
                }
            }
        )
    }

}

