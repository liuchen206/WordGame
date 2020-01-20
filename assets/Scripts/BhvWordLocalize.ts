const { ccclass, property } = cc._decorator;

@ccclass
export default class BhvWordLocalize extends cc.Component {
    @property
    _word: string = "";
    @property
    get word() {
        return this._word;
    }
    set word(value: string) {
        this._word = value;
        this.setWord(value);
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    setWord(word: string) {
        this.node.getComponent(cc.Label).string = word;
    }
}
