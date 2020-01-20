import BhvDragDrop from "./BhvDragDrop";
import BhvFrameIndex from "./BhvFrameIndex";
import BhvWordLocalize from "./BhvWordLocalize";

const { ccclass, property } = cc._decorator;

/**
 * 业务逻辑孔
 */
@ccclass
export default class CellItemSlot extends cc.Component {

    @property(cc.Node)
    dragItem: cc.Node = null;

    @property
    acceptWord: string = "";

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        let comp = this.dragItem.getComponent(BhvDragDrop);
        if (comp == null) {
            comp = this.dragItem.addComponent(BhvDragDrop);
            comp.parent = this.node.getParent();
        }
        comp.emitTarget = this.node; //将节点信号发送给本脚本
        this.node.opacity = 0;
    }

    start() {
        this.setItemWord(this.acceptWord);
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
        this.node.opacity = 55;
    }

    onDragMove(dragNode: cc.Node, tag: string) {

    }

    onDragDrop(dragNode: cc.Node, tag: string) {

    }

    onDropBack(dragNode: cc.Node, tag: string) {
        this.node.opacity = 0;
        console.log('ab');
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
        // this.setItemWord("");
    }

    onDragEnterArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {

    }

    onDragLeaveArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {

    }

    onDropInArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {
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

        this.dragItem.runAction(action);

    }

    //丢在区域外部，一般用于检测区域结束
    onDropOutArea(dragNode: cc.Node, dropNode: cc.Node, tag: string) {

    }



    // update (dt) {}
}

