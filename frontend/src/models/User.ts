export type User = {
  _id: string,
  name: string,
  email: string,
  isAdmin: boolean
};

export type LoginUser = {
  email: string,
  password: string
}

export type RegisterUser = {
  name: string,
  email: string,
  password: string
}