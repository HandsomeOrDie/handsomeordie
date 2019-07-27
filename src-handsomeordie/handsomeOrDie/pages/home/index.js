import React from "react";
import { connect } from "react-redux";
import Foot from "../../components/Foot";
import { Drawer, List, NavBar, Icon, Carousel, WingBlank, Grid } from "antd-mobile";
class HomePage extends React.Component{
    state = {
        open: false,
        data: ["1", "2", "3"],
        imgHeight: 176,
    }
      onOpenChange = (...args) => {
          console.log(args);
          this.setState({ open: !this.state.open });
      }
      componentDidMount() {
          // simulate img loading
          setTimeout(() => {
              this.setState({
                  data: ["AiyWuByWklrrUDlFignR", "TekJlZRVCjLFexlOCuWn", "IJOtIlfsYdTyaDTRVrLI"],
              });
          }, 100);
      }
      render() {
          // fix in codepen
          const sidebar = (<List>
              {[1, 2, 3, 4, 5, 6].map((i, index) => {
                  return (<List.Item key={index}
                      thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                  >Day{index+1}</List.Item>);
              })}
          </List>);
          const data = Array.from(new Array(9)).map((_val, i) => ({
              icon: "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png",
              text: `name${i}`,
          }));
          return (<div>
              <NavBar icon={<Icon type="ellipsis" />} onLeftClick={this.onOpenChange}>WELCOME</NavBar>
              <Drawer
                  className="my-drawer"
                  style={{ minHeight: document.documentElement.clientHeight }}
                  enableDragHandle
                  contentStyle={{ color: "#A6A6A6", textAlign: "center", paddingTop: 42 }}
                  sidebar={sidebar}
                  open={this.state.open}
                  onOpenChange={this.onOpenChange}
              >
                  <WingBlank>
                      <Carousel className="space-carousel"
                          frameOverflow="visible"
                          cellSpacing={10}
                          slideWidth={0.8}
                          autoplay
                          infinite
                          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                          afterChange={index => this.setState({ slideIndex: index })}
                      >
                          {this.state.data.map((val, index) => (
                              <a
                                  key={val}
                                  // href="http://www.alipay.com"
                                  style={{
                                      display: "block",
                                      position: "relative",
                                      top: this.state.slideIndex === index ? -10 : 0,
                                      height: this.state.imgHeight,
                                      boxShadow: "2px 1px 1px rgba(0, 0, 0, 0.2)",
                                  }}
                              >
                                  <img
                                      src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                                      alt=""
                                      style={{ width: "100%", verticalAlign: "top" }}
                                      onLoad={() => {
                                          // fire window resize event to change height
                                          window.dispatchEvent(new Event("resize"));
                                          this.setState({ imgHeight: "auto" });
                                      }}
                                  />
                              </a>
                          ))}
                      </Carousel>
                  </WingBlank>
                  <div className="sub-title">Always square grid item </div>
                  <Grid data={data} activeStyle={false} />
              </Drawer>
              {/* <Foot/> */}
          </div>);
      }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    
});
export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
