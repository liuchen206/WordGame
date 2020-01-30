import { GameDataRuntime, LevelTypes } from "./UserModel/UserModel";
import { IdiomList } from "./UserModel/StroageModel";
import CellItemSlot from "./CellItemSlot";
import BhvWordLocalize from "./BhvWordLocalize";
import { convertLocalToAnotherLocal } from "./Tools/Tools";
import BhvDropArea from "./BhvDropArea";
import BhvDragDrop from "./BhvDragDrop";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Gaming extends cc.Component {
    @property(cc.Prefab)
    wordObjPrefab: cc.Prefab = null;
    @property(cc.Node)
    slotRootNode: cc.Node = null;
    @property(cc.Node)
    wordObjRootNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.loadGame();
        console.log("cheakWin", this.cheakWin());

    }

    // update (dt) {}

    loadGame() {
        if (GameDataRuntime.LevelType == LevelTypes.Poem) {
            if (GameDataRuntime.LevelIndex < IdiomList.length) {
                let levelData = IdiomList[GameDataRuntime.LevelIndex];
                for (var i = 0; i < levelData.length; i++) { // 行
                    let row = levelData[i];
                    for (var j = 0; j < row.length; j++) {
                        let col = row[j];
                        console.log(col);
                        let soltNode = this.slotRootNode.children[i * row.length + j];
                        if (col == 0) {
                            soltNode.getComponent(CellItemSlot).init(true);
                            soltNode.removeComponent(BhvDropArea);
                        } else {
                            let wordObj = cc.instantiate(this.wordObjPrefab);
                            wordObj.position = convertLocalToAnotherLocal(soltNode.position, soltNode.parent, this.wordObjRootNode);
                            if (col[0] == '_') {
                                wordObj.getComponent(BhvDragDrop).isForbitDrag = true;
                                col = col.toString().slice(1);
                                soltNode.removeComponent(BhvDropArea);
                            }
                            wordObj.getChildByName("word").getComponent(BhvWordLocalize).word = col + "";
                            wordObj.parent = this.wordObjRootNode;
                            soltNode.getComponent(CellItemSlot).init(false, wordObj);
                        }
                    }
                }
            } else {
                console.log("尚未配置的关卡类型", "LevelType:", GameDataRuntime.LevelType, "LevelIndex:", GameDataRuntime.LevelIndex);
            }
        }
    }

    cheakWin() {
        if (GameDataRuntime.LevelType == LevelTypes.Poem) {
            if (GameDataRuntime.LevelIndex < IdiomList.length) {
                let levelData = IdiomList[GameDataRuntime.LevelIndex];
                for (var i = 0; i < levelData.length; i++) { // 行
                    let row = levelData[i];
                    for (var j = 0; j < row.length; j++) {
                        let col = row[j];
                        if (col != 0) {
                            let soltNode = this.slotRootNode.children[i * row.length + j];
                            let slot = soltNode.getComponent(CellItemSlot);
                            if (col[0] == '_') {
                                col = col.toString().slice(1);
                            }
                            if (slot.acceptWord != col) {
                                return false;
                            }
                        }
                    }
                }
            } else {
                console.log("尚未配置的关卡类型", "LevelType:", GameDataRuntime.LevelType, "LevelIndex:", GameDataRuntime.LevelIndex);
                return false;
            }
        }
        return true;
    }
}
