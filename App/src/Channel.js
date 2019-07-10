import React from "react";
import MessageForm from "./MessageForm";
import SingleChannelView from "./SingleChannelView";
import ChannelAdminView from "./ChannelAdminView";
import { toast, Flip } from "react-toastify";
import { ToastContainer } from "react-toastify";
import FollowButton from "./FollowButton";
import { channel } from "redux-saga";

export default class Channel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restricted: false,
      members: [],
      channelIndex: null
    };
  }
  forceUpdate = async () => {
    const channelData = await this.props.drizzle.contracts.DappChat.methods
      .getChannelData(this.props.channelIndex)
      .call();
    // console.log(channelData, "CHANNEL");
    const members = await this.props.drizzle.contracts.DappChat.methods
      .getMembersArray(this.props.channelIndex)
      .call();
    this.setState({
      channelOwner: channelData[0],
      restricted: channelData[4],
      userAddress: this.props.drizzleState.accounts[0],
      members,
      channelIndex: this.props.channelIndex
    });
  };

  openToast = () => {
    toast.info("Processing change...", {
      position: "top-right",
      autoClose: 10000,
      transition: Flip
    });
  };

  closeToast = () => {
    toast.dismiss();
  };

  checkMember = () => {
    if (this.state.restricted) {
      return !this.state.members.includes(this.state.userAddress);
    }
    return false;
  };

  render() {
    const { channelIndex } = this.props;
    const { drizzle, drizzleState } = this.props;
    const disabled = this.checkMember();

    if (this.props.channelIndex !== this.state.channelIndex) {
      this.forceUpdate();
    }

    return (
      <div>
        <ToastContainer />
        <FollowButton
          drizzle={drizzle}
          drizzleState={drizzleState}
          channelIndex={channelIndex}
        />
        {this.state.channelOwner === this.state.userAddress ? (
          <ChannelAdminView
            channelIndex={channelIndex}
            drizzle={drizzle}
            drizzleState={drizzleState}
            openToast={this.openToast}
            closeToast={this.closeToast}
          />
        ) : (
          ""
        )}
        <SingleChannelView
          channelIndex={channelIndex}
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
        <MessageForm
          channelIndex={channelIndex}
          drizzle={drizzle}
          disabled={disabled}
        />
      </div>
    );
  }
}
