import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";

import { RootStore } from "./rootStore";
import { toast } from "react-toastify";

export default class HubStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  hubConnection: HubConnection | null = null;

  createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        this.hubConnection!.invoke('AddToGroup', `${activityId}`)
      })
      .catch(error => console.log('Greska pri konekciji: ', error));

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.rootStore.activityStore.approvedActivity!.comments?.push(comment)
      })
    })

    this.hubConnection.on('Send', message => {
      toast.info(message);
    })
  };

  stopHubConnection = (activityId: string) => {
    this.hubConnection!.invoke('RemoveFromGroup', `${activityId}`)
      .then(() => {
        this.hubConnection!.stop()
      })
      .then(() => console.log('zavrsena konekcija'))
      .catch(err => console.log(err))
  }

  addComment = async (values: any) => {
    values.activityId = this.rootStore.activityStore.approvedActivity!.id;
    try {
      await this.hubConnection!.invoke('SendComment', values)
    } catch (error) {
      console.log(error);
    }
  } 

}
