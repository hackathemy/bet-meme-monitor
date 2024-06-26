import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import * as contractABI from './contracts/BetMemeABI.json';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly web3 = new Web3(process.env.ALCHEMY_URL);
  private contractAddress: string;
  private contract: any;
  private readonly account = process.env.ACCOUNT;
  private readonly privateKey = process.env.PRIVATE_KEY;

  setContractAddress(contractAddress: string) {
    this.contractAddress = contractAddress;
    this.contract = new this.web3.eth.Contract(
      contractABI as any,
      this.contractAddress,
    );
  }

  async monitorGames() {
    console.log('monitorGames');
    if (!this.contractAddress) {
      this.logger.error('Contract address is not set');
      return;
    }

    try {
      const games = await this.contract.methods.getGameList().call();

      for (const game of games) {
        if (game.isEnded) {
          continue;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        console.log( Number(game.startTime) + Number(game.duration)- Number(currentTime))

        if (!game.isEnded && game.startTime + game.duration <= currentTime) {
          this.logger.log('tx start');
          await this.endGame(game.gameId, 1000000000000000000); // lastPrice를 적절히 설정해야 합니다
        }
      }
    } catch (error) {
      this.logger.error(`Error monitoring games: ${error.message}`);
    }
  }

  async endGame(gameId: number, lastPrice: number) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const tx = {
      from: this.account,
      to: this.contractAddress,
      gas: 2000000,
      gasPrice: gasPrice,
      data: this.contract.methods.endGame(gameId, lastPrice).encodeABI(),
    };

    try {
      const signedTx = await this.web3.eth.accounts.signTransaction(
        tx,
        this.privateKey,
      );
      await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      this.logger.log(`Game ${gameId} ended successfully`);
    } catch (error) {
      this.logger.error(`Error ending game ${gameId}: ${error.message}`);
    }
  }
}
