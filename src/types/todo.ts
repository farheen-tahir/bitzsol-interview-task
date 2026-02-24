export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  //  flag for items created on device
  local?: boolean;
};
