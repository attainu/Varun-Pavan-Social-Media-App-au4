import React, { Component } from "react";
import ReactCrop from "react-image-crop";
import { connect } from "react-redux";
import axios from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "react-image-crop/dist/ReactCrop.css";
import './CSS/imageCropper.css'

class imageCropper extends Component {
  state = {
    src: null,
    modifiedDP: "",
    crop: {
      unit: "%",
      width: 40,
      aspect: 1
    }
  };

  componentDidMount() {
    var aspect;
    if (this.props.type === 'cp')
      aspect = 1.91;
    else if (this.props.type === 'dp')
      aspect = 1;
    this.setState({
      src: this.props.image,
      crop: {
        unit: "%",
        width: 40,
        aspect
      }
    })
  }

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    // console.log(crop);

    this.setState({ crop });
  };

  cancelDP = () => {
    this.setState({
      src: null
    });
    this.props.showImage();
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
  }

  sendData = async () => {
    await axios.put("http://localhost:3010/users/dp", {
      profilePic: this.state.croppedImageUrl,
      userId: this.props.userId,
      type: this.props.type
    }).then(() => this.props.showImage());
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <div className="App">
        <div>
        </div>
        {src && (
          <div className="overlay">
            <div className="close-icon">
              <IoIosCloseCircleOutline
                onClick={() => this.cancelDP()}
                size="large"
              />
            </div>
            <div className="overlay-content">
              <div>
                <h1 style={{ color: "white" }}>Create your profile picture</h1>
                <ReactCrop
                  src={src}
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                  style={{ width: "42rem" }}
                />
              </div>
              <div>
                <h1 style={{ color: "white" }}>DP Preview</h1>
                {croppedImageUrl && (
                  <>
                    <img
                      alt="Crop"
                      style={{ maxWidth: "100%" }}
                      src={croppedImageUrl}
                    />
                    <button
                      className="btn btn-info float-right mt-3"
                      style={{ display: "block" }}
                      onClick={() => this.sendData()}
                    >
                      {this.props.type === 'cp' ? 'Update Cover Pic ' : 'Update DP'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.app.userId,
  };
};

export default connect(mapStateToProps)(imageCropper);