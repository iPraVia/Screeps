import { TowerControll } from "structures/TowerControll";
import { LinkControll } from "structures/LinkControll";
import { roleCreateCreep } from "./CreateCreep";
import { roleHarvester } from "role/Harvester";
import { roleUpgrader } from "role/Upgrader";
import { roleRepairer } from "role/Repairer";
import { roleLinkener } from "role/Linkener";
import { roleBuilder } from "role/Builder";
import { roleSoldier } from "role/Soldier";

export class roleMaintenance  {

    private roomName:string;
    private myCreeps:Creep[];

    private maxNumHarvester!:number;
    private maxNumBuilder!: number;
    private maxNumUpgrader!:number;
    private maxNumRepairer!:number;
    private maxNumSoldier!:number;
    private maxNumLinkener!:number;

    constructor(roomName:string){
        this.roomName = roomName
        this.myCreeps = Game.rooms[this.roomName].find(FIND_MY_CREEPS);
    }

    public run():void{this.start()}

    private start():void{
        this.clearMemoryCreepDeath();
        this.maintenanceRoom();
        this.distributeCreep();
        this.searchAndAssignTower();
        this.searchAndAssignLink();
        this.asignModeBattle();
    }

    private countCreepAvailablesForRole(role:string):number{
        return _.filter(
            this.myCreeps,
            (creep:Creep) => {
                return creep.memory.role == role
            }
        ).length
    }

    private maintenanceCreepLvlOne():void{

        this.maxNumHarvester = 5;
        this.maxNumLinkener = 0;
        this.maxNumBuilder = 3;
        this.maxNumUpgrader = 2;
        this.maxNumRepairer = 1;
        this.maxNumSoldier = 1;

        this.createCreep();
    }

    private maintenanceCreepLvlTwo():void{

        this.maxNumHarvester = 4;
        this.maxNumLinkener = 0;
        this.maxNumBuilder = 2;
        this.maxNumUpgrader = 1;
        this.maxNumRepairer = 1;
        this.maxNumSoldier = 1;

        this.createCreep();

    }

    private maintenanceCreepLvlThree():void{

        this.maxNumHarvester = 2;
        this.maxNumLinkener = 1;
        this.maxNumBuilder = 1;
        this.maxNumUpgrader = 1;
        this.maxNumRepairer = 0;
        this.maxNumSoldier = 1;

        this.createCreep();

    }

    private createCreep():void{

        if(this.countCreepAvailablesForRole('harvester') == 0){roleCreateCreep.createCreepEmergency()}
        else if(this.countCreepAvailablesForRole('harvester') < this.maxNumHarvester){new roleCreateCreep('harvester',this.roomName).create()}
        else if(this.countCreepAvailablesForRole('linkener') < this.maxNumLinkener){new roleCreateCreep('linkener',this.roomName).create()}
        else if(this.countCreepAvailablesForRole('builder') < this.maxNumBuilder){new roleCreateCreep('builder',this.roomName).create()}
        else if(this.countCreepAvailablesForRole('upgrader') < this.maxNumUpgrader){new roleCreateCreep('upgrader',this.roomName).create()}
        else if(this.countCreepAvailablesForRole('repairer') < this.maxNumRepairer){new roleCreateCreep('repairer',this.roomName).create()}
        else if(this.countCreepAvailablesForRole('soldier') < this.maxNumSoldier){new roleCreateCreep('soldier',this.roomName).create()};

    }

    private maintenanceRoom():void{
        const energyCapacityAvailable:number = Game.rooms[this.roomName].energyCapacityAvailable;
        const lvlController:number | undefined = Game.rooms[this.roomName].controller?.level;

        if(lvlController){
            if(lvlController == 3 && energyCapacityAvailable < 1300){this.maintenanceCreepLvlOne()}
            else if(lvlController == 4 && energyCapacityAvailable >= 1300){this.maintenanceCreepLvlTwo()}
            else if(lvlController >= 5 && energyCapacityAvailable >= 1800){this.maintenanceCreepLvlThree()}
        }

    }

    private distributeCreep():void{
        for(const creep in Game.creeps){
            if(Game.creeps[creep].memory.role == "harvester"){new roleHarvester(Game.creeps[creep]).run()}
            else if(Game.creeps[creep].memory.role == 'linkener'){new roleLinkener(Game.creeps[creep]).run()}
            else if(Game.creeps[creep].memory.role == "builder"){new roleBuilder(Game.creeps[creep]).run()}
            else if(Game.creeps[creep].memory.role == "upgrader"){new roleUpgrader(Game.creeps[creep]).run()}
            else if(Game.creeps[creep].memory.role == "repairer"){new roleRepairer(Game.creeps[creep]).run()}
            else if(Game.creeps[creep].memory.role == "soldier"){new roleSoldier(Game.creeps[creep]).run()};
        }
    }

    private searchAndAssignLink():void{
        const links:StructureLink[] = Game.rooms[this.roomName].find(FIND_STRUCTURES, {
            filter: (structure:AnyStructure) => {
                return structure.structureType == STRUCTURE_LINK
            }
        });
        if(links.length){
            for(const link in links){new LinkControll(links[link]).run()}
        }
    }

    private searchAndAssignTower():void{
        const towers:StructureTower[] = Game.rooms[this.roomName].find(FIND_MY_STRUCTURES,{
            filter: (structure:AnyStructure) => {
                return structure.structureType == STRUCTURE_TOWER
            }
        });

        if(towers.length){
            for(const tower in towers){new TowerControll(towers[tower]).run()}
        }
    }

    private clearMemoryCreepDeath():void{
        for (const name in Memory.creeps) {
            if (!(name in Game.creeps)) {
              delete Memory.creeps[name];
            }
        }
    }

    private asignModeBattle():void{
        const enemy:Creep[] = Game.rooms[this.roomName].find(FIND_HOSTILE_CREEPS);

        if(!(enemy[0])){Game.spawns['Spawn1'].memory.modeBattle = false}
        else{this.findDamageCreep()}
    }

    private findDamageCreep():void{
        const creepDamage:Creep | undefined = this.myCreeps.find(
            (creep:Creep) => {return creep.hits < creep.hitsMax}
        );
        if(creepDamage){Game.spawns['Spawn1'].memory.modeBattle = true}
    }

}
