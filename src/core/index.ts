import {
    FIELD_NOT_GENERATED,
    INVALID_FILL_FACTOR,
    OUT_OF_RANGE,
    staticPuzzles6x6Medium,
    staticPuzzles6x6Hard
} from "../constants/error.constants";
import type { TileValues, VerificationResult } from "../types";
import { generateField, prepareField } from "./generator";
import { verifyField } from "./verification";
import {
    getRandomNumber
} from "./helpers";



export default class BinarioCore {
    constructor(size: number) {
        this.size = size;
    }

    readonly size: number;
    private field: string[][];
    public task: string[][];
    public cache: string[] = [];

    public generate() {
        let field: string[][] | null;
        let verifyResult: VerificationResult;
        while (!field || (verifyResult && verifyResult.isError)) {
            field = generateField(this.size);
            if (field) verifyResult = verifyField(field);
        }
        this.field = field;
    }

    public prepare(fillFactor = 0.33) {
        if (!this.field) throw new Error(FIELD_NOT_GENERATED);
        if (fillFactor > 1 || fillFactor < 0.2)
            throw new Error(INVALID_FILL_FACTOR);
        this.task = prepareField(this.field, fillFactor);
        if (this.size===6){
            this.task = staticPuzzles6x6Medium[getRandomNumber(staticPuzzles6x6Medium.length - 1)];
        }
    }

    public change(row: number, column: number, value: TileValues) {
        if (row >= this.size || row < 0) throw new Error(OUT_OF_RANGE("row"));
        if (column >= this.size || column < 0)
            throw new Error(OUT_OF_RANGE("column"));

        this.caching(row, column);
        this.task[row][column] = value;
    }

    private caching(row: number, column: number) {
        if (this.cache.length >= 100) this.cache = this.cache.slice(1, 100);
        this.cache.push(`${row}-${column}-${this.task[row][column]}`);
    }

    public undo() {
        if (!this.cache.length) return;
        const prevStep = this.cache[this.cache.length - 1].split("-");
        this.task[+prevStep[0]][+prevStep[1]] = prevStep[2];
        this.cache.pop();
    }

    public verify(): VerificationResult {
        return verifyField(this.task);
    }
}
