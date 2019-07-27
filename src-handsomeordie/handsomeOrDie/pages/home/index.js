import React from "react";
import { connect } from "react-redux";
import { NavBar, Icon, Grid, Drawer, List } from "antd-mobile";
class HomePage extends React.Component{
    state = {
        open: false,
    }
      onOpenChange = (...args) => {
          console.log(args);
          this.setState({ open: !this.state.open });
      }
      render() {
          const colors = [
              "#DE5055",
              "#FAAAC6",
              "#F7F316",
              "#C6E366",
              "#48D3C7",
              "#000000",
          ];
          const data = Array.from(new Array(6)).map((_val, i) => ({
              text: `name${i+1}`,
              itemStyle: {
                  background: colors[i],
                  color: "#fff",
                  height: "100%"
              }
          }));
          const sidebar = (<List>
              {[1, 2, 3, 4, 5, 6].map((i, index) => {
                  return (<List.Item key={index}
                      thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                  >Day{index+1}</List.Item>);
              })}
          </List>);
          return (<div>
              <NavBar style={{background:"#000"}} icon={<Icon type="ellipsis" />} onLeftClick={this.onOpenChange}>WELCOME</NavBar>
              <Drawer
                  className="my-drawer"
                  style={{ minHeight: document.documentElement.clientHeight - 45 }}
                  enableDragHandle
                  contentStyle={{ color: "#A6A6A6", textAlign: "center" }}
                  sidebar={sidebar}
                  open={this.state.open}
                  onOpenChange={this.onOpenChange}
              >
                  <div style={{background: "#48D3C7",fontSize: "16px", height: 60, lineHeight: "60px", color: "#fff", textAlign: "center"}}>Call me Frank!</div>
                  <Grid
                      renderItem={dataItem => (
                          <div style={dataItem.itemStyle}>
                              <div style={{position: "relative", top: "50%", transform: "translateY(-50%)", fontSize: "16px"}}>{dataItem.text}</div>
                          </div>
                      )}
                      data={data}
                      columnNum={2}
                  />
              </Drawer>
          </div>);
      }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    
});
export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
