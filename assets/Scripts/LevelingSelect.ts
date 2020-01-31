import { GameDataRuntime, LevelTypes } from "./UserModel/UserModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelingSelect extends cc.Component {
    @property({
        type: cc.Enum(LevelTypes),
    })
    levelType: LevelTypes = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
    onClick() {
        // todo index set
        GameDataRuntime.LevelType = this.levelType;
        cc.director.loadScene('Game')
    }
}
