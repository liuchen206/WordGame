import BhvDragDrop from "./BhvDragDrop";
import BhvWordLocalize from "./BhvWordLocalize";
import { waitForAction } from "./Tools/Tools";
import Gaming from "./Gaming";

const { ccclass, property } = cc._decorator;
/**
 * 业务逻辑孔
 * 1,如果是锁住的状态：不接收任何拖拽放置
 * 2，如果是打开的状态：初始化时必须设置初始的单字，能够接受其他单字的拖拽放置
 */
@ccclass
export default class CellItemSlot extends cc.Component {

    @property(cc.Node)
    dragItem: cc.Node = null;

    acceptWord: string = "";
    // LIFE-CYCLE CALLBACKS:
    @property({
        tooltip: '是否禁止拖拽放置'
    })
    isLocked: boolean = false;
    @property({
        visible: function () {
            return this.isLocked == false
        },
        tooltip: '禁止拖拽放置时，显示的颜色'
    })
    LockedColor: cc.Color = cc.color(0, 0, 0);
    onLoad() {

    }

    start() {

    }
    init(isLocked: boolean, wordOjb?: cc.Node) {
        if (isLocked == true) {
            this.isLocked = true;
            this.dragItem = null;
            this.node.color = this.LockedColor;
        } else {
            this.isLocked = false;
            this.dragItem = wordOjb;
            let comp = this.dragItem.getComponent(BhvDragDrop);
            if (comp == null) {
                console.log("设置的 dragItem 没有 BhvDragDrop 组件，无法捕获 拖拽事件");
            } else {
                comp.emitTarget = this.node; //将节点信号发送给本脚本
            }
            let word = this.dragItem.getChildByName("word").getComponent(BhvWordLocalize).word;
            if (word == null) {
                console.log("设置的 dragItem 没有 word 节点，无法捕获 设置初始的字符");
            } else {
                this.acceptWord = word;
            }
        }
    }
    setItemWord(word: string) {
        if (this.dragItem) {
            this.dragItem.getChildByName("word").getComponent(BhvWordLocalize).word = word;
            this.acceptWord = word;
        }
    }

    onEnable() {

        //拖拽基本事件
        this.node.on('onDragStart', this.onDragStart, this);
        this.node.on('onDragMove', this.onDragMove, this);
        this.node.on('onDragDrop', this.onDragDrop, this);
        this.node.on('onDropBack', this.onDropBack, this);

        //拖拽出界事件
        this.node.on('onMoveEnterOutRage', this.onMoveEnterOutRage, this);
        this.node.on('onMoveLeaveOutRage', this.onMoveLeaveOutRage, this);
        this.node.on('onDropOutRage', this.onDropOutRage, this);

        //区域基本事件
        this.node.on('onDragEnterArea', this.onDragEnterArea, this);
        this.node.on('onDragLeaveArea', this.onDragLeaveArea, this);
        this.node.on('onDropInArea', this.onDropInArea, this);
        this.node.on('onDropOutArea', this.onDropOutArea, this);

    }

    onDragStart(dragNode: cc.Node, tag: string) {
    }

    onDragMove(dragNode: cc.Node, tag: string) {

    }

    onDragDrop(dragNode: cc.Node, tag: string) {

    }

    onDropBack(dragNode: cc.Node, tag: string) {
        console.log('onDropBack');
    }

    onMoveEnterOutRage(dragNode: cc.Node, tag: string) {
        console.log('移出到了外面-', dragNode.name);
    }

    onMoveLeaveOutRage(dragNode: cc.Node, tag: string) {
        console.log('移回来了里面-', dragNode.name);
    }

    //丢出范围外，一般用于删除道具的判断
    onDropOutRage(dragNode: cc.Node, tag: string) {
        console.log('丢掉了道具-', dragNode.name);
    }

    onDragEnterArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {

    }

    onDragLeaveArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {

    }

    async onDropInArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {
        if (this.isLocked == true) return;

        //交换两个道具的信息
        let target = dragNode.getComponent(BhvDragDrop).emitTarget;

        let selfItem = target.getComponent(CellItemSlot);
        let otherItem = dropNode.getComponent(CellItemSlot);
        let selfWord = selfItem.acceptWord;
        let otherWord = otherItem.acceptWord;

        selfItem.setItemWord(otherWord);
        otherItem.setItemWord(selfWord);

        let action = cc.sequence([
            cc.scaleTo(0.05, otherItem.node.scale * 1.2).easing(cc.easeBackIn()),
            cc.scaleTo(0.2, otherItem.node.scale).easing(cc.easeBackOut())
        ])
        await waitForAction(this.dragItem, action);
        console.log("cheakWin", cc.find("Canvas/Gaming").getComponent(Gaming).cheakWin());
    }

    //丢在区域外部，一般用于检测区域结束
    onDropOutArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {

    }



    // update (dt) {}
}

