<script lang="ts">
    import { onMount } from "svelte";
    import BackBtn from "../components/Buttons/BackBtn.svelte";
    import UndoBtn from "../components/Buttons/UndoBtn.svelte";
    import UpdateBtn from "../components/Buttons/UpdateBtn.svelte";
    import Counter from "../components/Counter.svelte";
    import Field from "../components/Field.svelte";
    import ErrorMessage from "../components/Messages/ErrorMessage.svelte";
    import Overlay from "../components/Messages/Overlay.svelte";
    import WinModal from "../components/Messages/WinMessage.svelte";
    import Timer from "../components/Timer.svelte";
    import BinarioCore from "../core";
    import { countSubstring } from "../core/helpers";
    import type { TileValues, VerificationResult } from "../types";

    export let size: number;
    const totalTiles = size ** 2;
    const binario = new BinarioCore(size);
    let verificationResult: VerificationResult;
    let errorLines: HTMLDivElement[] = [];

    $: tileStats = `0/${totalTiles}`;
    $: isPlay = true;
    $: verificationResult = { isError: false, message: null, position: [], type: null };

    binario.generate()
    binario.prepare()

    function changeTile(row: number, column: number, value: TileValues) {
        binario.change(row, column, value)
        countTiles();
    }

    function undo() {
        if (!binario.cache.length) return;
        let tile: HTMLDivElement;
        const prevStep = binario.cache[binario.cache.length - 1].split("-")

        tile = document.getElementById(`${prevStep[0]}-${prevStep[1]}`) as HTMLDivElement;
        tile.classList.remove("tile_1")
        tile.classList.remove("tile_0")

        if (prevStep[2] === "1" || prevStep[2] === "0") {
            tile.classList.add(`tile_${prevStep[2]}`)
        }
        binario.undo()
        countTiles();
    }

    function countTiles() {
        let unsolved = 0;
        binario.task.forEach(row => {
            unsolved += countSubstring(row.join(''), "x")
        })
        tileStats = `${(totalTiles) - unsolved}/${totalTiles}`
        if (unsolved == 0) {
            verificationResult = binario.verify()
            verificationResult.isError ? showError() : isPlay = false;
        } else if (unsolved == 1 && errorLines.length)  {
            for (let i = 0; i < errorLines.length; i++) {
                errorLines[i].classList.remove("tile_error");
            }
            errorLines = [];
            verificationResult.isError = false;
        } else {
            verificationResult.isError = false;
        }
    }

    function showError() {
        console.log(verificationResult)
        let tile: HTMLDivElement
        const errorPos = verificationResult.position
        for (let i = 0; i < errorPos.length; i++) {
            const lineIndex = +errorPos[i].split("-")[1];
            if (errorPos[i].includes("row")) {
                for (let j = 0; j < size; j++) {
                    tile = document.getElementById(`${lineIndex}-${j}`) as HTMLDivElement
                    tile.classList.add("tile_error")
                    errorLines.push(tile);
                }
            } else {
                for (let j = 0; j < size; j++) {
                    tile = document.getElementById(`${j}-${lineIndex}`) as HTMLDivElement
                    tile.classList.add("tile_error")
                    errorLines.push(tile);
                }
            }
        }
    }

    onMount(() => {
        countTiles();
    })

</script>

{#if !isPlay}
    <Overlay><WinModal/></Overlay>
{/if}

<div class="stats">
    <div class="stats__btns">
        <BackBtn />
        <UpdateBtn />
    </div>
    <Timer isPlay="{isPlay}" />
    <Counter tileStats="{tileStats}"/>
</div>

<div class="content">
    <div class="instructions">
        <h2>Game Instructions</h2>
        <ul>
            <li>More than two tiles of the same color can't be adjacent. Therefore, if two adjacent cells contain the same color, the cells next must contain the other color (xxx00x → xx1001).</li>
            <li>Each row and each column must contain an equal number of tiles of each color. (For example, if you are playing on an 8x8 field, each column and row must contain 4 tiles of each color.)</li>
            <li>Each row and column must be unique.</li>
        </ul>
    </div>

    <div class="game">
        <Field binario="{binario}" changeTile="{changeTile}" />
        <div class="undo">
            <UndoBtn undo="{undo}"/>
        </div>
    </div>
</div>

{#if verificationResult.isError}
    <ErrorMessage>{verificationResult.message}</ErrorMessage>
{/if}

<style lang="scss">
  .stats {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem 4.2rem;
    &__btns {
      display: flex;
      flex-direction: row;
      gap: 1.5rem;
      z-index: 3;
    }
  }

  .content {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 1rem 4.2rem;
  }

  .instructions {
    width: 45%;
    padding-right: 2rem;
  }

  .game {
    width: 55%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .undo {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>
