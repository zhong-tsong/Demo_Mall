import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtSwipeAction } from 'taro-ui'
// 全局设置
import { PUBLIC_URL } from '@config';
// 全局公共组件
import { AtInputNumber, AtCheckbox, AtTag, ActionSheet } from '@com';
// less样式
import './index.less'

class Index extends Taro.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            isOpened01: false,
            atActionSheetItem: []
        };
    }

    componentDidMount() {
      this.setState({
        checkedList: this.props.checkedArr || []
      })
    }
    componentWillReceiveProps(nextProps) {
      if( JSON.stringify(nextProps.checkedArr) != JSON.stringify(this.props.checkedArr)) {
        this.setState({
          checkedList: nextProps.checkedArr || []
        })
      }
    }

    // 数量
    watchNumber = (item, value) => {
      const { onGetNumber } = this.props;
      if( typeof onGetNumber === 'function' ) {
        onGetNumber(item, value);
      }
    }

    // 被选中
    handleChange = (value) => {
      const { onSelectedCurrent } = this.props;
      if( typeof onSelectedCurrent === 'function' ) {
        onSelectedCurrent(value);
      }
      this.setState({
        checkedList: value
      })
    }
    
    // 打开 - 活动面板
    showActionSheet = (currentObj={}) => {
      const { onSelectSpec } = this.props;
      if( typeof onSelectSpec === 'function' ) {
        onSelectSpec(currentObj).then((res=[]) => {
          const BUTTONS = res.map(item => {
            let obj = {
              id: item.id,
              value: item.spec
            }
            if( item.id == currentObj.pid ) {
              obj = {...obj, isActive: true}
            }
            return obj;
          });
          this.setState({
            atActionSheetItem: BUTTONS,
            isOpened01: true
          })
        });
      }
    }

    // 获取 - 活动面板数据
    getActionSheet = (id, e) => {
      if( typeof this.props.onHandleToggleSpecs === 'function' && id ) {
        this.onCancel();
        this.props.onHandleToggleSpecs(id, e).then((code) => {
          if(code != 200) {
            throw new Error('规格出错了');
          }
        });
      }
    }

    // 关闭 - 活动面板
    onCancel = () => {
      this.setState({
        atActionSheetItem: [],
        isOpened01: false
      })
    }

    // 滑动操作
    onAtSwipeActionClick = (id, item={}) => {
      if( typeof this.props.onAtSwipeActionClick === 'function' ) {
        this.props.onAtSwipeActionClick(item.type, id);
      }
    }

    render() {
        const { products=[], isShowTag=false, isShowSpec=false, isShowSpecOther=false, isShowCheckbox=false, isShowNum=false, isShowAtSwipeAction=true } = this.props;
        const { checkedList, isOpened01, atActionSheetItem } = this.state;
        return (
          <View className='dm_productList'>
            {
              products.map((item, index) => {
                return (
                  <AtSwipeAction key={index} autoClose disabled={!isShowAtSwipeAction}
                    options={[
                      { type: 'col', text: '加入收藏', style: {
                          backgroundColor: '#1890FF'
                        }
                      },
                      { type: 'del', text: '删除', style: {
                          backgroundColor: '#0E80D2'
                        }
                      }
                    ]}
                    onClick={this.onAtSwipeActionClick.bind(this, item.id)}
                  >
                      <View className='main_content'>
                          {
                            isShowCheckbox && (
                              <AtCheckbox
                                className='left'
                                options={[
                                  { value: item.id }
                                ]}
                                selectedList={checkedList}
                                onChange={this.handleChange}
                              />
                            )
                          }
                          <Image mode='heightFix' src={item.mainPicture ? PUBLIC_URL + item.mainPicture : ''} />          
                          <View className='content'>
                            <Text className='title'>{item.description}</Text>
                            {
                              isShowTag && (
                                <View className='tag'>
                                  {item.screenSize && item.screenSize != '其他' ? <AtTag size='small'>{item.screenSize}</AtTag> : ''}
                                  {item.gpu && item.gpu != '其他' ? <AtTag size='small'>{item.gpu.length > 16 ? item.gpu.slice(0, 16) + '...' : item.gpu}</AtTag> : ''}
                                  {item.memory && item.memory != '其他' ? <AtTag size='small'>{item.memory}</AtTag> : ''}
                                </View>
                              )
                            }
                            {
                              isShowSpec && (
                                <View className='spec' onClick={this.showActionSheet.bind(this, item)}>
                                  <View>{item.spec}</View>
                                  <AtIcon value='chevron-down' size={16} color='#555' />
                                </View>
                              )
                            }
                            {
                              isShowSpecOther && (
                                <View className='spec'>
                                  <View>{item.spec}</View>
                                  <AtIcon value='' size={16} color='#555' />
                                </View>
                              )
                            }
                            <View className='price_and_other'>
                              <View className='price'>
                                <Text>￥</Text>
                                { item.price ? Number(item.price).toFixed(2) : 0 }
                              </View>
                              {
                                isShowNum && (                              
                                  <View className='num'>
                                    <AtInputNumber
                                      min={1}
                                      max={99}
                                      step={1}
                                      value={item.num || 1}
                                      onChange={this.watchNumber.bind(this, item)}
                                    />
                                  </View>
                                )
                              }
                            </View>
                          </View>
                      </View>
                  </AtSwipeAction>
                );
              })
            }
            <ActionSheet 
              {...this.props}
              isOpened={isOpened01}
              title='请选择规格'
              cancelText='关闭'
              atActionSheetItem={atActionSheetItem}
              onClick={this.getActionSheet}
              onClose={this.onCancel}
              onCancel={this.onCancel}
            />
          </View>
        );
    }
}

export default Index;