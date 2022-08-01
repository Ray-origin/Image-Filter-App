import { useState, useRef } from "react";
import "./App.css";
import Slider from "./Slider";
import SidebarItem from "./SidebarItem";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";

const DEFAULT_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Hue Rotate",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360,
    },
    unit: "deg",
  },
  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: {
      min: 0,
      max: 20,
    },
    unit: "px",
  },
];

function App() {
  const [options, setOption] = useState(DEFAULT_OPTIONS);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [image, setImage] = useState("");
  const selectedOption = options[selectedOptionIndex];
  const imgRef = useRef();
  function handleSliderChange({ target }) {
    setOption((prevOps) => {
      return prevOps.map((option, index) => {
        if (index !== selectedOptionIndex) return option;
        return { ...option, value: target.value };
      });
    });
  }

  function getImageStyle() {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });
    return { filter: filters.join("") };
  }

  const loadImage = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const resetImage = () => {
    setOption(DEFAULT_OPTIONS);
  };

  const downloadImage = () => {
    htmlToImage
      .toPng(imgRef.current)
      .then(function (dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        saveAs(img.src, "my-image");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <div className="image-container">
        <img
          ref={imgRef}
          src={image}
          className="main-image"
          alt=""
          style={getImageStyle()}
        />
      </div>
      <div className="sidebar">
        {options.map((option, index) => {
          return (
            <SidebarItem
              key={index}
              name={option.name}
              active={index === selectedOptionIndex}
              handleClick={() => {
                setSelectedOptionIndex(index);
              }}
            />
          );
        })}
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSliderChange}
      />
      <div className="input">
        <div>
          <input id="file" type={"file"} style={{display:'none'}} accept="image/*" onChange={loadImage} />
          <label htmlFor="file">Choose an image</label>
        </div>
        <div>
          <button id="downLoad"  style={{display:'none'}} onClick={downloadImage}>Download Image</button>
          <label htmlFor="downLoad">Download image</label>
        </div>
        <div>
          <button id="reset" style={{bottom:"0px",left:"0px",display:'none'}}  onClick={resetImage}>Reset Img</button>
          <label htmlFor="reset">Reset image</label>
        </div>
      </div>
    </div>
  );
}

export default App;
