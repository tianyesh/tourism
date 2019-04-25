export default function ({ store, redirect }) {
  console.log(store.state.adminInfo)
  if (!store.state.adminInfo.id) {
   return redirect('/login')
  }
 }