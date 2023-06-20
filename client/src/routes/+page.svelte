<script lang="ts">
  import io, { Socket } from "socket.io-client"; 

  const socket: Socket = io("http://localhost:3000"); 

  let joined: boolean = false;  

  let room: string = "";
  let display: string = "";

  const connected = new Map<string, { name: string, position: { x: number, y: number } }>();
  let movements: any[] = [];

  const handleJoin = () => {
    socket.emit("join", { display: display, room: room })
    socket.on("join_response", join_response);
  }

  const join_response = (response: any) => {
    if (response.status === "joined") {
      joined = true;
    }
  }

  const handleMove = (e: MouseEvent) => {
    socket.emit("input", { display: display, room: room, position: { x: e.clientX, y: e.clientY } });
    socket.on("input_response", receive);
  }

  const receive = (args: any) => {
    const { display, position } = args;
    connected.set(display, { name: display, position: position });
    movements = Array.from(connected.values());
  }
</script>

<div class="multi-draw">

  {#if !joined}
    <div class="multi-draw__join">
      <input class="multi-draw__join-room" type="text" placeholder="room name" bind:value={room}>
      <input class="multi-draw__join-display" type="text" placeholder="display name" bind:value={display}>
      <button on:click={handleJoin}>join</button>
    </div>
  {:else}
    <div class="multi-draw__arena" on:mousemove={handleMove}>
      {#each movements as player}
        <div class="multi-draw__arena-player" style="position: absolute; left: {player.position.x}px; top: {player.position.y}px">
          <p class="multi-draw__icon">{player.name}</p>
        </div>  
      {/each}
    </div>
  {/if}

</div>

<style lang="scss">

  .multi-draw {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(13, 13, 13);

    &__join {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &__join-room, &__join-display {
      text-align: center;
      outline: none;
    }

    &__arena {
      width: 1024px;
      height: 768px;
      background-color: rgb(20, 20, 20);

      &-player {
        width: 2px;
        height: 2px;
        border-radius: 100%;
        background-color: red;
      }
    }

    &__icon {
      color: white;
      opacity: 0.5;
    }
  }

</style>