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
    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(cc.Label)
    labelLevel: cc.Label = null;
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
        this.randomWords();
        console.log("cheakWin", this.cheakWin());
    }

    // update (dt) {}
    setTitle() {
        if (GameDataRuntime.LevelType == LevelTypes.Poem) {
            this.labelTitle.string = "古诗";
        }
        if (GameDataRuntime.LevelType == LevelTypes.Idiom) {
            this.labelTitle.string = "成语";
        }
        this.labelLevel.string = "关卡：" + (GameDataRuntime.LevelIndex + 1);
    }
    loadGame() {
        this.setTitle();
        if (GameDataRuntime.LevelType == LevelTypes.Poem) {
            if (GameDataRuntime.LevelIndex < IdiomList.length) {
                let levelData = IdiomList[GameDataRuntime.LevelIndex];
                for (var i = 0; i < levelData.length; i++) { // 行
                    let row = levelData[i];
                    for (var j = 0; j < row.length; j++) {
                        let col = row[j];
                        console.log(col);
                        let soltNode = this.slotRootNode.children[i * row.length + j];
                        if (col == "0") {
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

    randomWords() {
        let levelData = IdiomList[GameDataRuntime.LevelIndex];
        // 找到两个非空的wordobj
        let row = levelData[0];
        let randomWord = "0";
        let randomI = 0;
        let randomJ = 0;
        while (randomWord == "0" || randomWord[0] == "_") {
            randomI = Math.floor(Math.random() * levelData.length);
            randomJ = Math.floor(Math.random() * row.length);
            randomWord = levelData[randomI][randomJ];
        }
        let randomWord2 = "0";
        let randomI2 = 0;
        let randomJ2 = 0;
        while (randomWord2 == "0" || randomWord2[0] == "_" || randomWord2 == randomWord) {
            randomI2 = Math.floor(Math.random() * levelData.length);
            randomJ2 = Math.floor(Math.random() * row.length);
            randomWord2 = levelData[randomI2][randomJ2];
        }
        // 交换两个word
        this.exchangeWordObj(randomI, randomJ, randomI2, randomJ2, row.length);
        console.log("交换", randomI, randomJ, "to", randomI2, randomJ2, randomWord, "to", randomWord2);
    }

    exchangeWordObj(i, j, i2, j2, rowLength) {
        let firstSlot = this.slotRootNode.children[i * rowLength + j];
        let secondSlot = this.slotRootNode.children[i2 * rowLength + j2];
        let firstSlotWord = firstSlot.getComponent(CellItemSlot).acceptWord;
        let secondSlotWord = secondSlot.getComponent(CellItemSlot).acceptWord;
        firstSlot.getComponent(CellItemSlot).setItemWord(secondSlotWord);
        secondSlot.getComponent(CellItemSlot).setItemWord(firstSlotWord);
    }
    cheakWin() {
        if (GameDataRuntime.LevelType == LevelTypes.Poem) {
            if (GameDataRuntime.LevelIndex < IdiomList.length) {
                let levelData = IdiomList[GameDataRuntime.LevelIndex];
                for (var i = 0; i < levelData.length; i++) { // 行
                    let row = levelData[i];
                    for (var j = 0; j < row.length; j++) {
                        let col = row[j];
                        if (col != "0") {
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

    onBackLobby() {
        cc.director.loadScene('Lobby');
    }
    onRefresh() {
        this.randomWords();
    }
    onHits(){
        // 找到一个错误的 slot
        // 找到错误的 slot 对应的 word 且 该word在自己的slot上也时错误的
    }
}
