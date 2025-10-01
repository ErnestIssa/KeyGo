export type RootTabParamList = {
  Home: undefined;
  RequestsNearby: undefined;
  GetDriverNow: undefined;
  MyRequests: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  RequestDetails: { requestId: string };
  Chat: { requestId: string; otherUserId: string };
  Payment: { requestId: string; amount: number };
};
