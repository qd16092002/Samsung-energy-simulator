import useStorage, { StorageType } from "@/hooks/use-storage";

class Storage {
  private localStorage = useStorage(StorageType.LOCAL);
  private sessionStorage = useStorage(StorageType.SESSION);

  // Access Token
  getAccessToken() {
    return this.sessionStorage.getItem("accessToken");
  }
  updateAccessToken(accessToken: string) {
    this.sessionStorage.setItem("accessToken", accessToken);
  }
  removeAccessToken() {
    this.sessionStorage.removeItem("accessToken");
  }

  // Refresh Token
  getRefreshToken() {
    return this.sessionStorage.getItem("refreshToken");
  }
  updateRefreshToken(refreshToken: string) {
    this.sessionStorage.setItem("refreshToken", refreshToken);
  }
  removeRefreshToken() {
    this.sessionStorage.removeItem("refreshToken");
  }

  // User ID
  getUserId() {
    return this.sessionStorage.getItem("userId");
  }
  updateUserId(userId: string) {
    this.sessionStorage.setItem("userId", userId);
  }
  removeUserId() {
    this.sessionStorage.removeItem("userId");
  }

  // Username (Save ID)
  getSavedUsername() {
    return this.localStorage.getItem("username");
  }
  saveUsername(username: string) {
    this.localStorage.setItem("username", username);
  }
  removeSavedUsername() {
    this.localStorage.removeItem("username");
  }

  // Save ID
  getSaveID() {
    return JSON.parse(this.localStorage.getItem('saveID') || 'false');
  }
  saveSaveID(saveID: boolean) {
    this.localStorage.setItem('saveID', JSON.stringify(saveID));
  }
  removeSaveID() {
    this.localStorage.removeItem('saveID');
  }


  // List Service
  getListService() {
    const listServices = this.sessionStorage.getItem("listService");
    return listServices ? JSON.parse(listServices) : null;
  }
  updateListService(listServices: any) {
    const data = JSON.stringify(listServices);
    this.sessionStorage.setItem("listService", data);
  }
  removeListService() {
    this.sessionStorage.removeItem("listService");
  }

  // User Info
  saveUserInfo(user: any) {
    const data = JSON.stringify(user);
    this.sessionStorage.setItem("userInfor", data);
  }
  getUserInfo() {
    const user = this.sessionStorage.getItem("userInfor");
    return user && user !== "null" ? JSON.parse(user) : {};
  }
  removeUserInfo() {
    this.sessionStorage.removeItem("userInfor");
  }

  clearStorage() {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUserId();
    this.removeListService();
    this.removeUserInfo();
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Storage();
