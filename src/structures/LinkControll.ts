export class LinkControll {

    private link:StructureLink;

    constructor(link:StructureLink){
        this.link = link;
    }

    public run():void{this.start()}

    private start():void{
        if(this.isFrom()){this.sendCharge()}
    }

    private sendCharge():void{
        if(
            this.link.store.getFreeCapacity(RESOURCE_ENERGY) == 0 &&
            this.link.cooldown == 0
        ){
            const linkTo:StructureLink | null = this.findLinkTo();
            if(linkTo){this.link.transferEnergy(linkTo)}
        }
    }

    private findLinkTo():StructureLink | null{
        const linkTo:StructureLink | null= this.link.pos.findClosestByPath(FIND_STRUCTURES,{
            filter: (structure:AnyStructure) => {
                return (
                    structure.structureType == STRUCTURE_LINK
                )&& structure != this.link
            }
        });
        if(linkTo){return linkTo}
        else{return null}
    }

    private isFrom():boolean{
        const source = this.link.pos.findClosestByRange(FIND_SOURCES);
        if(source){return true}
        else{return false}
    }

}
