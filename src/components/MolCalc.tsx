/* tslint:disable */
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {css, StyleSheet} from 'aphrodite';
import * as React from 'react';

const styles = StyleSheet.create({
    noPrint: {
        '@media print': {
            display: "none",
        },
    },
});

interface MolCalcState {
    weightDigit: number,
    volumeDigit: number,
    molDigit: number,
    purityDigit: number,
    solventDigit: number,
    reagents: number,
    nameCheck: boolean,
    concCheck: boolean,
    densityCheck: boolean,
    purityCheck: boolean,
    solventCheck: boolean,

    amountMode: boolean,
    concModeList: boolean[],

    smMg: number,
    smMl: number,
    smMmol: number,

    eqList: number[],
    mwList: number[],
    concList: number[],
    densityList: number[],
    purityList: number[],

    solventConc: number,
}

const updateState = <T extends string | boolean | boolean[] | number | number[]>(key: keyof MolCalcState, value: T) => (
    prevState: MolCalcState
): MolCalcState => ({
    ...prevState,
    [key]: value
});

class MolCalc extends React.Component<any, MolCalcState> {
    constructor(props: any) {
        super(props);
        this.state = {
            weightDigit: 1,
            volumeDigit: 3,
            molDigit: 2,
            solventDigit: 0,
            purityDigit: 0,
            reagents: 1,
            nameCheck: true,
            concCheck: false,
            densityCheck: true,
            purityCheck: false,
            solventCheck: true,

            amountMode: true,
            concModeList: [false, false],

            smMg: 0,
            smMl: 0,
            smMmol: 0,

            eqList: [1, 0],
            purityList: [100, 100],
            densityList: [0, 0],
            mwList: [0, 0],
            concList: [0, 0],

            solventConc: 0.1,
        };
    }

    public componentDidMount(): void {
        document.title = "モル計算機";
    }

    private setMw = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, i: number): void => {
        const value = Number(e.target.value);
        if (value < 0) {
            return;
        }
        this.state.mwList[i] = value;
        if (i === 0) {
            if (this.state.amountMode) {
                this.setState({mwList: this.state.mwList, smMmol: Number.isFinite(this.state.smMg / value) ? (this.state.smMg / value) : 0});
            } else {
                this.setState({mwList: this.state.mwList, smMg: this.state.smMmol * value})
            }
        } else {
            this.setState({mwList: this.state.mwList});
        }
    };

    private setConc = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, i: number): void => {
        const value = Number(e.target.value);
        if (value < 0) {
            return;
        }
        this.state.concList[i] = value;
        if (i === 0) {
            if (this.state.amountMode) {
                this.setState({concList: this.state.concList, smMmol: this.state.smMg * value});
            } else {
                this.setState({concList: this.state.concList, smMg: Number.isFinite(this.state.smMmol / value) ? this.state.smMmol / value : 0})
            }
        } else {
            this.setState({concList: this.state.concList});
        }
    };

    private setEq = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, i: number): void => {
        const value = Number(e.target.value);
        if (value >= 0) {
            this.state.eqList[i] = value;
            this.setState({eqList: this.state.eqList});
        }
    };

    private setAmount = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>): void => {
        const value = Number(e.target.value);
        if (value < 0) {
            return;
        }
        if (e.target.name === "smMg") {
            this.setState({smMg: value, amountMode: true});
        }
        if (e.target.name === "smMl") {
            this.setState({smMl: value, amountMode: true});
        }
        if (e.target.name === "smMmol") {
            this.setState({smMmol: value, amountMode: false});
        }
    };

    private getMl = (): string => {
        if (this.state.amountMode) {
            return String(this.state.smMl);
        }
        if (this.state.concModeList[0]) {
            if (this.state.concList[0] === 0) {
                return (0).toFixed(this.state.volumeDigit);
            }
            return (Number(this.getSmMmol()) / this.state.concList[0]).toFixed(this.state.volumeDigit);
        }
        if (this.state.purityList[0] === 0 || this.state.densityList[0] === 0) {
            return (0).toFixed(this.state.volumeDigit);
        }
        return (this.state.mwList[0] * this.state.smMmol / this.state.densityList[0] / this.state.purityList[0] / 10).toFixed(this.state.volumeDigit);
    };

    private getSmMmol = (): string => {
        if (!this.state.amountMode) {
            return String(this.state.smMmol);
        }
        if (this.state.concModeList[0]) {
            if (this.state.concList[0] === 0) {
                return (0).toFixed(this.state.molDigit);
            }
            return (this.state.concList[0] * this.state.smMl).toFixed(this.state.molDigit);
        }
        if (this.state.mwList[0] === 0) {
            return (0).toFixed(this.state.molDigit);
        }
        if (this.state.densityList[0] === 0) {
            return (this.state.smMg / this.state.mwList[0] * this.state.purityList[0] / 100).toFixed(this.state.molDigit);
        }
        if (this.state.densityList[0] !== 0) {
            return (this.state.smMl / this.state.mwList[0] * this.state.purityList[0] * this.state.densityList[0] * 10).toFixed(this.state.molDigit)
        }
        return "0"
    };

    private setDensity = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, i: number): void => {
        const value = Number(e.target.value);
        if (value < 0) {
            return;
        }
        const previous = this.state.densityList[i];
        this.state.densityList[i] = value;
        this.setState({densityList: this.state.densityList});
        // mg → mL
        if (i === 0 && previous === 0 && value !== 0) {
            if (this.state.amountMode) {
                this.setState({smMl: this.state.smMg / 1000});
            } else {
                const mg = this.state.purityList[0] !== 0 ? this.state.mwList[0] * this.state.smMmol / this.state.purityList[0] * 100 : 0;
                this.setState({smMl: mg / 1000 / previous})
            }
        }
        // mL → mg
        if (i === 0 && previous !== 0 && value === 0) {
            if (this.state.amountMode) {
                this.setState({smMg: this.state.smMl * 1000 * previous});
            } else {
                const ml = this.state.purityList[0] !== 0 ? this.state.mwList[0] * this.state.smMmol / this.state.densityList[0] / this.state.purityList[0] / 10 : 0;
                this.setState({smMg: ml * 1000 * previous});
            }
        }
    };

    public storeData = () => {
        localStorage.setItem("molcalc", JSON.stringify(this.state));
        alert("現在の入力値を保存しました");
    };

    public readData = () => {
        try {
            const data = JSON.parse(localStorage.getItem("molcalc") || "{}");
            if (Object.keys(data).length === 0) {
                alert("データが保存されていませんでした");
                return;
            }
            Object.keys(data).map((value: string) => {
                this.setState(updateState(value as keyof MolCalcState, data[value]));
            });
            alert("保存されていた入力値を読み込みました");
        } catch {
            alert("データを正常に読み込めませんでした");
            return;
        }
    };

    private setPurity = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, i: number): void => {
        const value = Number(e.target.value);
        if (value <= 0 || value > 100 || !Number.isFinite(value)) {
            return;
        }
        this.state.purityList[i] = value;
        this.setState({purityList: this.state.purityList});
    };

    private changeConcMode = (i: number): void => {
        this.state.concModeList[i] = !this.state.concModeList[i];
        this.setState({concModeList: this.state.concModeList});
    };

    private getReagentAmount = (i: number): string => {
        const mw = this.state.mwList[i];
        const conc = this.state.concList[i];
        const concMode = this.state.concModeList[i];
        const reagentMmol = this.state.eqList[i] * Number(this.getSmMmol());
        const density = this.state.densityList[i];
        const purity = this.state.purityList[i] / 100 || 1;
        const weightDight = this.state.weightDigit;
        const volumeDigit = this.state.volumeDigit;
        if (!Number.isFinite(mw) || !Number.isFinite(reagentMmol) || (concMode && !Number.isFinite(1 / conc))) {
            if (density === 0 || !Number.isFinite(density)) {
                return (0).toFixed(weightDight);
            }
            return (0).toFixed(volumeDigit);
        }
        if (concMode) {
            return (reagentMmol / conc / purity).toFixed(volumeDigit);
        }
        if (density === 0 || !Number.isFinite(density)) {
            return (mw * reagentMmol / purity).toFixed(weightDight);
        }
        return (mw * reagentMmol / density / purity / 1000).toFixed(volumeDigit);
    };

    public render() {
        const digitSetting = (title: string, labelWidth: number, id: keyof MolCalcState) => (
            <FormControl variant={"outlined"} style={{marginLeft: "20px", width:"80px"}}>
                <InputLabel htmlFor="weightDigit" shrink={true}>{title}</InputLabel>
                <OutlinedInput type={'number'}
                               labelWidth={labelWidth}
                               id={id}
                               value={this.state[id]}
                               onChange={e => Number(e.target.value) >= 0 && Number(e.target.value) <= 100 ? this.setState(updateState(id, e.target.value)) : null}
                               inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                />
            </FormControl>
        );
        const itemSwitch = (title: string, id: keyof MolCalcState) => (
            <FormControlLabel control={
                <Switch checked={this.state[id] as any as string}
                          onChange={() => this.setState(updateState(id, !this.state[id]))}
                          value={id}/>
            }
                              label={title}
            />
        );
        const setting = (
            <React.Fragment>
                <Typography variant={"caption"} style={{margin: "10px 0 20px 20px"}}>小数点以下の桁数をそれぞれ指定してください　上部の設定項目は印刷時表示されません</Typography>
                {digitSetting("重量", 30, "weightDigit")}
                {digitSetting("体積", 30, "volumeDigit")}
                {digitSetting("モル量", 50, "molDigit")}
                {digitSetting("溶媒量", 50, "solventDigit")}
                {digitSetting("純度", 30, "purityDigit")}
                <FormControl variant={"outlined"} style={{marginLeft: "60px", width:"80px"}}>
                    <InputLabel htmlFor="weightDigit" shrink={true}>加える<br/>試薬数</InputLabel>
                    <OutlinedInput type={'number'}
                                   labelWidth={50}
                                   value={this.state.reagents}
                                   onChange={e => Number(e.target.value) >= 0 && Number(e.target.value) <= 50 ? this.setState({reagents: Number(e.target.value)}) : null}
                                   inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                    />
                </FormControl>
                <div style={{marginLeft: "20px"}}>
                    {itemSwitch("試薬名", "nameCheck")}
                    {itemSwitch("濃度スイッチ", "concCheck")}
                    {itemSwitch("比重", "densityCheck")}
                    {itemSwitch("純度", "purityCheck")}
                    {itemSwitch("溶媒", "solventCheck")}
                </div>
                <div style={{marginLeft: "10px"}}>
                    <Button variant={"contained"} color={"primary"}
                            size={"small"} style={{marginLeft: "10px"}}
                            onClick={() => this.storeData()}>データをローカルストレージに保存する</Button>
                    <Button variant={"contained"} color={"primary"}
                            size={"small"} style={{marginLeft: "10px"}}
                            onClick={() => this.readData()}>データをローカルストレージから読み出す</Button>
                </div>
                <Typography variant={"caption"} style={{margin: "10px 0 20px 20px"}}>試薬の濃度指定をする場合、比重と純度は計算から無視されます</Typography>
            </React.Fragment>
        );

        const label = (
            <TableRow>
                <TableCell align={"center"} style={{minWidth: "140px", display: this.state.nameCheck ? "" : "none"}}>試薬名</TableCell>
                <TableCell align={"center"} style={{minWidth: "70px"}}>分子量<span style={this.state.concCheck ? {} : {display: "none"}}>/濃度<span className={css(styles.noPrint)}>（スイッチ）</span></span></TableCell>
                <TableCell align={"center"} style={{minWidth: "90px"}}>重量<span style={this.state.densityCheck || this.state.concCheck ? {} : {display: "none"}}>/体積</span></TableCell>
                <TableCell align={"center"} style={{minWidth: "90px"}}>モル量</TableCell>
                <TableCell align={"center"} style={{minWidth: "50px"}}>当量</TableCell>
                <TableCell align={"center"} style={{minWidth: "70px", display: this.state.densityCheck ? "" : "none"}}>比重</TableCell>
                <TableCell align={"center"} style={{minWidth: "70px", display: this.state.purityCheck ? "" : "none"}}>w/w純度</TableCell>
            </TableRow>
        );

        const startingMaterial = (
            <TableRow>
                <TableCell style={{display: this.state.nameCheck ? "" : "none"}}>
                    <Input type={'text'}/>
                </TableCell>
                <TableCell>
                    <span style={this.state.concCheck ? {} : {display: "none"}}>
                        <Switch checked={this.state.concModeList[0]}
                                onChange={() => {this.changeConcMode(0)}}
                                className={css(styles.noPrint)}
                        />
                    </span>
                    <Input type={'number'}
                           value={this.state.mwList[0]}
                           onChange={ e => this.setMw(e, 0)}
                           inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                           style={this.state.concModeList[0] ? {display: "none"} : {}}
                    />
                    <Input type={'number'}
                           value={this.state.concList[0]}
                           onChange={ e => this.setConc(e, 0)}
                           inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                           style={this.state.concModeList[0] ? {} : {display: "none"}}
                           endAdornment={" M"}
                    />
                </TableCell>
                <TableCell align={"right"}>
                    <Input type={'number'}
                           name={"smMg"}
                           inputProps={{
                               step: Math.pow(10, -1 * this.state.weightDigit),
                               onFocus: e => e.target.select(),
                               style: {textAlign: "right", display: this.state.densityList[0] === 0 && !this.state.concModeList[0] ? "" : "none"}}}
                           value={this.state.amountMode ? this.state.smMg : this.state.purityList[0] !== 0 ? (this.state.mwList[0] * this.state.smMmol / this.state.purityList[0] * 100).toFixed(this.state.weightDigit) : 0}
                           onChange={this.setAmount}
                           endAdornment={this.state.densityList[0] === 0 && !this.state.concModeList[0] ? "mg" : ""}
                    />
                    <Input type={'number'}
                           name={"smMl"}
                           inputProps={{
                               step: Math.pow(10,  -1 * this.state.volumeDigit),
                               onFocus: e => e.target.select(),
                               style: {textAlign: "right", display: this.state.densityList[0] === 0 && !this.state.concModeList[0] ? "none" : ""}}}
                           value={this.getMl()}
                           onChange={this.setAmount}
                           endAdornment={this.state.densityList[0] === 0 && !this.state.concModeList[0] ? "" : "mL"}
                    />
                </TableCell>
                <TableCell align={"right"}>
                    <Input type={'number'}
                           name={"smMmol"}
                           inputProps={{step: Math.pow(10, -1 * this.state.molDigit), onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                           value={this.getSmMmol()}
                           onChange={this.setAmount}
                           endAdornment={" mmol"}
                    />
                </TableCell>
                <TableCell align={"right"}>
                    <Typography variant={"subtitle1"}>1</Typography>
                </TableCell>
                <TableCell className={this.state.densityList[0] === 0 ? css(styles.noPrint) : ""} style={{display: this.state.densityCheck ? "" : "none"}}>
                    <Input type={'number'}
                           value={this.state.densityList[0]}
                           onChange={ e => this.setDensity(e, 0)}
                           inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                    />
                </TableCell>
                <TableCell style={{display: this.state.purityCheck ? "" : "none"}}>
                    <Input type={'number'}
                           value={this.state.purityList[0].toFixed(this.state.purityDigit)}
                           onChange={ e => this.setPurity(e, 0)}
                           inputProps={{step: Math.pow(10, -1 * this.state.purityDigit), onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                           endAdornment={"%"}
                    />
                </TableCell>
            </TableRow>
        );

        const reagent = (i: number): any => {
            return (
                <TableRow>
                    <TableCell style={{display: this.state.nameCheck ? "" : "none"}}>
                        <Input type={'text'}/>
                    </TableCell>
                    <TableCell>
                        <span style={this.state.concCheck ? {} : {display: "none"}}>
                            <Switch checked={this.state.concModeList[i]}
                                    onChange={() => {this.changeConcMode(i)}}
                                    className={css(styles.noPrint)}
                            />
                        </span>
                        <Input type={'number'}
                               value={this.state.mwList[i] || 0}
                               onChange={ e => this.setMw(e, i)}
                               inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                               style={this.state.concModeList[i] ? {display: "none"} : {}}
                        />
                        <Input type={'number'}
                               value={this.state.concList[i] || 0}
                               onChange={ e => this.setConc(e, i)}
                               inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                               style={this.state.concModeList[i] ? {} : {display: "none"}}
                               endAdornment={" M"}
                        />
                    </TableCell>
                    <TableCell align={"right"}>
                        <Typography variant={"subtitle1"}>
                            {this.getReagentAmount(i)} {(this.state.densityList[i] === 0 || this.state.densityList[i] === undefined) && !this.state.concModeList[i] ? "mg" : "mL"}
                        </Typography>
                    </TableCell>
                    <TableCell align={"right"}>
                        <Typography variant={"subtitle1"}>
                            {(this.state.eqList[i] * Number(this.getSmMmol()) || 0).toFixed(this.state.molDigit)} mmol
                        </Typography>
                    </TableCell>
                    <TableCell align={"right"}>
                        <Input type={'number'}
                               value={this.state.eqList[i] || 0}
                               onChange={ e => this.setEq(e, i)}
                               inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                        />
                    </TableCell>
                    <TableCell className={this.state.densityList[i] === 0 || this.state.densityList[i] === undefined ? css(styles.noPrint) : ""} style={{display: this.state.densityCheck ? "" : "none"}}>
                        <Input type={'number'}
                               value={this.state.densityList[i] || 0}
                               onChange={e => this.setDensity(e, i)}
                               inputProps={{onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                        />
                    </TableCell>
                    <TableCell style={{display: this.state.purityCheck ? "" : "none"}}>
                        <Input type={'number'}
                               value={(this.state.purityList[i] || 100).toFixed(this.state.purityDigit)}
                               onChange={e => this.setPurity(e, i)}
                               inputProps={{step: Math.pow(10, -1 * this.state.purityDigit), onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                               endAdornment={"%"}
                        />
                    </TableCell>
                </TableRow>
            );
        };

        const solventLabel = (
            <TableRow style={{display: this.state.solventCheck ? "" : "none"}}>
                <TableCell align={"center"}>溶媒</TableCell>
                <TableCell align={"center"}>溶媒量</TableCell>
                <TableCell align={"center"}>濃度</TableCell>
                <TableCell rowSpan={2} colSpan={3}/>
            </TableRow>
        );

        const solvent = (
            <TableRow style={{display: this.state.solventCheck ? "" : "none"}}>
                <TableCell>
                    <Input type={'text'} inputProps={{fontSize: "50%"}}/>
                </TableCell>
                <TableCell align={"right"}>
                    <Typography variant={"subtitle1"}>
                        {Number.isFinite(Number((Number(this.getSmMmol()) / this.state.solventConc).toFixed(this.state.solventDigit))) ? (Number(this.getSmMmol()) / this.state.solventConc).toFixed(this.state.solventDigit) : 0} mL
                    </Typography>
                </TableCell>
                <TableCell>
                    <Input type={'number'}
                           value={this.state.solventConc}
                           onChange={e => this.setState({solventConc: Number(e.target.value) > 0 ? Number(e.target.value) : 0})}
                           inputProps={{step: 0.1, onFocus: e => e.target.select(), style: {textAlign: "right"}}}
                           endAdornment={" M"}
                    />
                </TableCell>
            </TableRow>
        );

        return (
            <div>
                <div style={{paddingTop: "20px"}} className={css(styles.noPrint)}>{setting}</div>
                <Table padding={"dense"}>
                    <TableHead>
                        {label}
                    </TableHead>
                    <TableBody>
                        {startingMaterial}
                        {(() => {
                            const reagents = [];
                            for (let i = 1; i < this.state.reagents + 1; i++) {
                                reagents.push(<React.Fragment key={i}>{reagent(i)}</React.Fragment>)
                            }
                            return <React.Fragment>{reagents}</React.Fragment>;
                        })()}
                    </TableBody>
                    <TableHead>
                        {solventLabel}
                    </TableHead>
                    <TableBody>
                        {solvent}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
export default MolCalc;
