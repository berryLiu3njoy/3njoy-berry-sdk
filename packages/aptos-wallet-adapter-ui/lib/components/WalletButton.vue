<template>
  <div v-if="walletStore.address.value" class="aptos-adapter-wallet-button-box">
    <button class="aptos-adapter-wallet-button">
      <img :src="walletStore.icon.value" class="aptos-adapter-wallet-button-icon" />
      {{ SHORT_ADDRESS(walletStore.address.value) }}
    </button>
    <div class="aptos-adapter-wallet-button-dropdown">
      <div class="button-dropdown-list">
        <div class="button-dropdown-item" @click="copy">Copy Address</div>
        <div class="button-dropdown-item" @click="selectWallet">Select Wallet</div>
        <div class="button-dropdown-item" @click="disconnectWallet">Disconnect</div>
      </div>
    </div>
  </div>
  <button class="aptos-adapter-wallet-button" @click="connect" v-else>Connect</button>

  <WalletModal v-model:visible="walletStore.walletModalOpen.value" />
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { walletStore, useConnect } from '@berryliu/aptos-wallet-adapter';

  import { SHORT_ADDRESS } from '../utils';
  import WalletModal from './WalletModal.vue';

  const props = defineProps({
    autoConnect: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['copied', 'disconnected']);

  const { autoConnect } = useConnect();

  const connect = () => {
    walletStore.walletModalOpen.value = true;
  };

  const copy = () => {
    window.navigator.clipboard.writeText(walletStore.address.value);
    emits('copied');
  };

  const selectWallet = () => {
    walletStore.walletModalOpen.value = true;
  };

  const disconnectWallet = () => {
    walletStore.walletProvider.value.disconnect();
    walletStore.clear();
    emits('disconnected');
  };

  onMounted(() => {
    if (props.autoConnect) {
      autoConnect();
    }
  });
</script>

<style lang="less">
  .aptos-adapter-wallet-button-box {
    position: relative;
    width: 200px;

    .aptos-adapter-wallet-button-dropdown {
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      visibility: hidden;

      .button-dropdown-list {
        box-sizing: border-box;
        background-color: white;
        border-radius: 10px;
        padding: 12px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 4px;
      }

      .button-dropdown-item {
        width: 100%;
        cursor: pointer;
        padding: 10px;
        text-align: center;
        border-radius: 10px;
        &:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }

    &:hover {
      .aptos-adapter-wallet-button-dropdown {
        visibility: visible;
      }
    }
  }

  .aptos-adapter-wallet-button {
    width: 200px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    cursor: pointer;
    padding: 12px 40px;
    display: flex;
    gap: 12px;

    .aptos-adapter-wallet-button-icon {
      width: 30px;
      height: 30px;
      border-radius: 10px;
    }
  }
</style>

