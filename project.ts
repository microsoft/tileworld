namespace tileworld {

    export class Project {
        private lastRule: IdRule;
        public defaultTile: number;
        private allImages: Image[];
        private _player: number;
        private _world: Image;

        constructor(
            private fixedImages: Image[],      // the number of fixed sprites
            private movableImages: Image[],    // the number of movable sprites
            private rules: IdRule[]     // the rules
        ) {
            this.defaultTile = 0;
            this.lastRule = null;
            this.allImages = [];
            this._player = -1;
            this._world = null;
            this.fixedImages.forEach(s => { this.allImages.push(s) });
            this.movableImages.forEach(s => { this.allImages.push(s) });
        }

        public setPlayer(kind: number) {
            this._player = kind;
        }

        public getPlayer() {
            return this._player;
        }

        public setWorld(img: Image) {
            this._world = img;
        }

        public getWorld() {
            return this._world;
        }

        // images

        public fixed() { return this.fixedImages; }
        public movable() { return this.movableImages; }
        public all() { return this.allImages; }

        getImage(kind: number) {
            return 0 <= kind && kind < this.allImages.length ? this.allImages[kind] : null;
        }

        getKind(img: Image) {
            return this.allImages.indexOf(img);
        }

        // rules 

        public getRules() { return this.rules; }

        public getRule(rid: number) {
            if (this.lastRule == null || this.lastRule.id != rid) {
                this.lastRule = this.rules.find(r => r.id == rid);
            }
            return this.lastRule.rule;
        }

        private wrapRule(r: Rule) {
            let newRule = new IdRule(this.rules.length, r);
            this.rules.push(newRule);
            return newRule.id;
        }

        public makeRule(kind: number, rt: RuleType, dir: MoveDirection): number {
            return this.wrapRule(makeNewRule([kind], rt, dir));
        }

        public removeRule(rid: number) {
            // TODO
        }

        public getRuleIds(): number[] {
            return this.rules.map(r => r.id);
        }

        public getRulesForKind(kind: number): number[] {
            return this.rules.filter(r => r.rule.kind.indexOf(kind) != -1).map(r => r.id)
        }

        public getKinds(rid: number): number[] {
            return this.getRule(rid).kind;
        }

        public setKinds(rid: number, kind: number[]) {
            this.getRule(rid).kind = kind;
        }

        public getType(rid: number) {
            return this.getRule(rid).rt;
        }

        public setType(rid: number, rt: RuleType) {
            this.getRule(rid).rt = rt;
        }

        public getDir(rid: number): MoveDirection {
            return this.getRule(rid).dir;
        }

        public setDir(rid: number, dir: MoveDirection) {
            this.getRule(rid).dir = dir;
        }

        public getWhenDo(rid: number, col: number, row: number) {
            let whendo = this.getRule(rid).whenDo.find(wd => wd.col == col && wd.row == row);
            if (whendo == null)
                return -1;
            else
                return this.getRule(rid).whenDo.indexOf(whendo);
        }

        public makeWhenDo(rid: number, col: number, row: number) {
            let whenDo = new WhenDo(col, row, [], []);
            this.getRule(rid).whenDo.push(whenDo);
            return this.getRule(rid).whenDo.length - 1;
        }

        public getAttr(rid: number, wdid: number, aid: number): AttrType {
            return this.getRule(rid).whenDo[wdid].attrs[aid];
        }

        public setAttr(rid: number, wdid: number, aid: number, attr: AttrType) {
            this.getRule(rid).whenDo[wdid].attrs[aid] = attr;
        }

        public getInst(rid: number, wdid: number, cid: number) {
            let c = this.getRule(rid).whenDo[wdid].commands[cid];
            return (c == null) ? -1 : c.inst;
        }

        public getArg(rid: number, wdid: number, cid: number) {
            let c = this.getRule(rid).whenDo[wdid].commands[cid];
            return (c == null) ? -1 : c.arg;
        }

        public setInst(rid: number, wdid: number, cid: number, n: number) {
            let commands = this.getRule(rid).whenDo[wdid].commands;
            while (cid >= commands.length && cid < 4) {
                commands.push(new Command(-1, -1));
            }
            commands[cid].inst = n;
        }

        public setArg(rid: number, wdid: number, cid: number, n: number) {
            let commands = this.getRule(rid).whenDo[wdid].commands;
            while (cid >= commands.length && cid < 4) {
                commands.push(new Command(-1, -1));
            }
            commands[cid].arg = n;
        }

        public removeCommand(rid: number, wdid: number, cid: number) {
            let commands = this.getRule(rid).whenDo[wdid].commands;
            if (cid < commands.length) {
                commands.removeAt(cid);
            }
        }
    }
} 