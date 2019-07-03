import MyComponent from './MyComponent'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => {
  // console.log(state.contracts, 'CONTRACTS')
  console.log("state ", state)

  return ({
  accounts: state.accounts,
  Twittor: state.contracts.Twittor,
  drizzleStatus: state.drizzleStatus
})}

const MyContainer = drizzleConnect(
  MyComponent,
  mapStateToProps
)

export default MyContainer
