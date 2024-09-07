import axios from "axios";
import React, { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate } from "react-router-dom";

function ImageGrid(props: { userId: string; needReload: boolean }) {
    const [allImages, setAllImages] = useState([]);
    const navigate= useNavigate()
  let userId = props.userId;
  let needReload = props.needReload;


  const getImages = async () => {
    try {
      console.log({ userId });
      const images = await axios.post(
        `${process.env.REACT_APP_API_URL}/images/getall`,
        { userId }
      );
      console.log(images.data.data.posts);
      setAllImages(images.data.data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getImages();
  }, [needReload]);
  return (
    <div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
        <Masonry  >
          {allImages.map((data: any) => {
            return (
              <>
              <div className="p-2 m-1 bg-gray-200 rounded-xl hover:bg-teal-200 cursor-pointer">
                <img onClick={()=>{navigate(`/post/${data?._id}`)}} src={data?.imagePath} alt="image" className="rounded-xl" />
            </div>
              </>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default ImageGrid;
