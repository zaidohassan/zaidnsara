import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Chip from '@material-ui/core/Chip';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';
import './MainPage.css';
import axios from 'axios';

const styles = theme => ({
  card: {
    width: 300,
    height: 300,
    margin: '2%'
  },
  picContainer: {
    width: '95%',
    margin: '200px auto 0px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  dialog: {
    maxWidth: 500,
    margin: 'auto'
  },
  media: {
    height: 300
  },
  img: {
    width: 350
  },
  dialogContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  deleteButtonContainer: {
    height: '3vh',
    width: '3vw'
  },
  dialogButtonInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  tagContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5%'
  },
  sendTagButton: {
    width: '100%'
  },

  chip: {
    margin: '4%'
  },
  [theme.breakpoints.down('sm')]: {
    dialogContainer: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap'
    },
    dialogButtonInputContainer: {
      height: 'auto'
    },
    img: {
      width: '100%'
    },
    chip: {
      '& span': {
        whiteSpace: 'normal'
      }
    }
  }
});

class MainPage extends Component {
  constructor() {
    super();
    this.state = {
      uploadedPics: [],
      open: false,
      disabled: true,
      id: 0,
      url: '',
      color: '',
      filterWord: '',
      keys: '',
      tags: '',
      tagsArr: []
    };
  }

  componentDidMount() {
    this.getData();
    window.addEventListener('scroll', this.listenScrollEvent);
    window.addEventListener('keypress', this.myHeart);
  }

  getData() {
    axios.get('/auth/getPics').then(pics => {
      axios.get('/auth/getTags').then(tags => {
        this.setState({ tagsArr: tags.data });
      });
      this.setState({ uploadedPics: pics.data });
    });
  }

  listenScrollEvent = e => {
    if (window.scrollY > 100) {
      this.setState({ color: '#89e1ff' });
    } else {
      this.setState({ color: '' });
    }
  };

  updateInput = (val, id) => {
    this.setState({ [id]: val, disabled: false });
  };

  addTag = () => {
    axios
      .post('/auth/addTags', { id: this.state.id, tag: this.state.tags })
      .then(response => {
        this.setState({
          tagsArr: response.data,
          tags: '',
          disabled: true
        });
      });
  };

  handleClickOpen = value => {
    for (let i = 0; i < this.state.uploadedPics.length; i++) {
      if (this.state.uploadedPics[i].id === value) {
        this.setState({
          url: this.state.uploadedPics[i].pic,
          keys: this.state.uploadedPics[i].keys,
          id: this.state.uploadedPics[i].id
        });
      }
    }
    this.setState({ open: !this.state.open, id: value });
  };

  handleClose = () => {
    this.setState({ open: false, id: 0, url: '', tags: '' });
  };

  upload = e => {
    let data = new FormData();
    data.append('pic', e.target.files[0]);
    axios
      .post('/auth/uploadPic', data)
      .then(data => {
        this.setState({
          uploadedPics: [...this.state.uploadedPics, data.data[0]]
        });
      })
      .catch(err => console.log(err));
  };

  myHeart = (value, id) => {
    let filteredWord = value;
    const element = document.querySelector('.heart');
    element.classList.add('animated', 'heartBeat', 'slow');
    this.setState({ [id]: value });
    if (filteredWord) {
      let filterSearch = this.state.tagsArr.filter(fw => {
        if (fw.tag[0].indexOf(filteredWord) !== -1) {
          let newUploadedPics = [];
          for (let i = 0; i < this.state.uploadedPics.length; i++) {
            if (+fw.id === this.state.uploadedPics[i].id) {
              newUploadedPics.push(this.state.uploadedPics[i]);
            }
          }
          this.setState({ uploadedPics: newUploadedPics });
        }
      });
    } else {
      this.getData();
    }
  };

  deletePic = () => {
    axios
      .post(`/auth/deletePic/${this.state.id}`, { keys: this.state.keys })
      .then(response => {
        this.setState({
          uploadedPics: response.data
        });
        this.handleClose();
      });
  };

  handleDelete = (tag, id) => {
    axios.post('/auth/deleteTag', { id: this.state.id, tag }).then(response => {
      this.setState({ tagsArr: response.data });
    });
  };

  render() {
    const { classes } = this.props;
    let cardArr = [];
    for (let i = 0; i < this.state.tagsArr.length; i++) {
      if (this.state.id === +this.state.tagsArr[i].id) {
        cardArr = this.state.tagsArr[i].tag;
      }
    }
    let displayPics = this.state.uploadedPics.map((pics, i) => {
      let newTags = cardArr.map((card, i) => {
        return (
          <Chip
            label={card}
            key={i}
            className={classes.chip}
            onDelete={() => this.handleDelete(card, this.state.id)}
          />
        );
      });
      return (
        <Card className={classes.card} key={i}>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            fullWidth={true}
            className={classes.dialog}
          >
            <DialogContent className={classes.dialogContainer}>
              <DialogContentText id='alert-dialog-description'>
                <img
                  src={this.state.url}
                  alt='stupid butt'
                  className={classes.img}
                />
              </DialogContentText>
              <div className={classes.dialogButtonInputContainer}>
                <div
                  onClick={() => this.deletePic()}
                  className={classes.deleteButtonContainer}
                >
                  <i className='fas fa-times-circle' id='delete-button' />
                </div>
                {newTags}
                <div style={{ width: '100%' }}>
                  <div className={classes.tagContainer}>
                    <input
                      type='text'
                      onChange={e => this.updateInput(e.target.value, 'tags')}
                      value={this.state.tags}
                    />
                    {this.state.disabled ? null : (
                      <div onClick={() => this.addTag()}>
                        <i className='far fa-paper-plane sendTagButton' />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions />
          </Dialog>
          <CardMedia
            onClick={() => this.handleClickOpen(pics.id)}
            className={classes.media}
            image={pics.pic}
          />
        </Card>
      );
    });
    const styleScroll = {
      background: this.state.color,
      top: 0,
      height: '10vh'
    };
    const styleScrollBox = { margin: '20px auto' };
    return (
      <div className='MainPage'>
        <div className='container'>
          <div className='filter_input_container'>
            <input
              type='text'
              value={this.state.filterWord}
              placeholder='Type to Search'
              className='filter_input'
              onChange={e => this.myHeart(e.target.value, 'filterWord')}
            />
            <i className='fas fa-heartbeat fa-2x heart' />
          </div>
        </div>
        <div
          className='fileUploadContainer'
          style={this.state.color ? styleScroll : null}
        >
          <div
            className='fileUploadBox'
            style={this.state.color ? styleScrollBox : null}
          >
            <label htmlFor='file-upload' className='custom-file-upload'>
              <i className='fas fa-upload' style={{ paddingLeft: '25%' }} />
              Upload
            </label>
            <input id='file-upload' type='file' onChange={this.upload} />
          </div>
        </div>
        <div className={classes.picContainer}>{displayPics}</div>
      </div>
    );
  }
}

export default withStyles(styles)(MainPage);
