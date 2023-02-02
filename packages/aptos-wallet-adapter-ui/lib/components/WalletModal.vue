<template>
  <teleport to="body">
    <div class="adapter-wallet-modal" v-if="visible">
      <div class="adapter-wallet-modal-body">
        <span class="adapter-wallet-modal-close-btn" @click="closeHandler">X</span>
        <div class="adapter-wallet-modal-title">Select Wallet</div>
        <div class="adapter-wallet-modal-list">
          <div
            class="adapter-wallet-modal-item"
            v-for="(wallet, index) in walletStore.walletList.value"
            :key="wallet.name"
            @click="choose(wallet)"
          >
            <img :src="wallet.icon" />
            <span>{{ wallet.name }}</span>
            <span
              class="wallet-install-btn"
              v-if="!wallet.isInstalled()"
              @click.stop="toInstallWallet(wallet)"
            >
              Click to Install
            </span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
  import { walletStore, useConnect } from '@berryliu/aptos-wallet-adapter';

  const { connectWallet } = useConnect();
  const emits = defineEmits(['update:visible', 'connected', 'error']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });

  const choose = async (wallet: any) => {
    const provider = wallet.provider;
    console.log(wallet.provider);
    if (provider) {
      try {
        await connectWallet(wallet);
        emits('connected');
        emits('update:visible', false);
      } catch (error: any) {
        emits('error', error.message || error);
      }
    } else {
      emits('error', `Maybe ${wallet.name} is not installed! Refresh page and try again!`);
    }
  };

  const toInstallWallet = (wallet: any) => {
    if (wallet.url) {
      window.open(wallet.url, '_blank');
    }
  };

  const closeHandler = () => {
    emits('update:visible', false);
  };
</script>

<style lang="less">
  .adapter-wallet-modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    .adapter-wallet-modal-body {
      box-sizing: border-box;
      width: 500px;
      min-height: 300px;
      background-color: white;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      padding: 40px;
      position: relative;
      margin: 0 10px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .adapter-wallet-modal-close-btn {
      cursor: pointer;
      width: 20px;
      height: 20px;
      position: absolute;
      right: 40px;
      top: 50px;
      text-align: center;
    }

    .adapter-wallet-modal-title {
      font-size: 30px;
      font-weight: 600;
    }

    .adapter-wallet-modal-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .adapter-wallet-modal-item {
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: 500;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .wallet-install-btn {
        margin-left: auto;
        font-size: 12px;

        &:hover {
          color: #999;
        }
      }
    }
  }
</style>

