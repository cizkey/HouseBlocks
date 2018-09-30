const {ccclass, property} = cc._decorator;
import PlaySceneInterface from './PlaySceneInterface'
import SceneMediator from './SceneMediator'
import Factory from './Factory'
import Model from './Model'

@ccclass
export default class PlayScene extends cc.Component implements PlaySceneInterface {

    @property(cc.Button)
    backBtn: cc.Button = null;
    @property(cc.Prefab)
    housePrefab: cc.Prefab = null;
    @property(cc.Sprite)
    background: cc.Sprite = null;
    @property(cc.Sprite)
    house_onRope: cc.Sprite = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    private houseFactory: Factory = null;

    onLoad (): void {
        this.initUiEvents();
        this.initTouchEvents();
        this.initFactorys();
        this.initPhysics();
        this.initArray();
    }

    start(): void {
        this.node.on('scoreUp', ()=>{
            cc.log("up");
            this.scoreLabel.string = Model.getInstance().score.toString();
            event.stopPropagation();
        });
    }

    initFactorys(): void {
        this.houseFactory = new Factory(
            cc.instantiate(this.housePrefab),
            10
        );
    }

    initUiEvents(): void {
        this.backBtn.node.on('click', ()=>{
            SceneMediator.getInstance().gotoStartScene();
        });
        this.scoreLabel.string = "0";
    }

    initTouchEvents():void {
        this.background.node.on('touchstart', ()=>{
            console.log("touch!");
            this.addHouse();
        })
    }

    initPhysics(): void {
        let pm: cc.PhysicsManager = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -620);
    }

    initArray(): void {
        Model.getInstance().score = 0.5;
        Model.getInstance().houseGroup = new Array<cc.Node>();
    }

    addHouse(): void {
        let node: cc.Node = cc.instantiate(this.housePrefab);
        let targetNode: cc.Node = this.house_onRope.node;
        let worldPoint: cc.Vec2 = targetNode.parent.convertToWorldSpaceAR(targetNode.position);
        let localPoint: cc.Vec2 = this.background.node.convertToNodeSpaceAR(worldPoint);
        let pos: cc.Vec2 = cc.v2(localPoint.x, localPoint.y - node.height/2);
        node.parent = this.background.node;
        node.position = pos;
        Model.getInstance().houseGroup.push(node);
    }
}