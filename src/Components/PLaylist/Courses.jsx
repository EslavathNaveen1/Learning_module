import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    { 
      title: "C# Tutorial",
      image: "/images/cimage.jpg" 
    },
    { 
      title: "JavaScript Basics",
      image: "/images/javascript.jpg" 
    },
    { 
      title: "Python for Beginners",
      image: "/images/Python.jpg" 
    },
    { 
      title: "React Development",
      image: "/images/react.jpg" 
    },
    { 
      title: "Data Science with R",
      image: "/images/datascience.jpg" 
    },
    { 
      title: "Machine Learning",
      image: "/images/machinelearning.jpg" 
    },
    { 
      title: "Web Development",
      image: "/images/webdevelopment.jpg" 
    },
    { 
      title: "Android Development",
      image: "/images/android.jpg" 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 
        className="text-3xl font-bold text-center mb-8"
        style={{ color: "#A32CC4" }}
      >
        Popular Courses
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
          
            <div className="w-full h-48 overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                src={course.image}
                alt={course.title}
                onError={(e) => {
                  console.error(`Failed to load image for ${course.title}`);
                  e.target.src = `https://via.placeholder.com/300x200?text=${course.title.replace(/\s+/g, '+')}`;
                }}
              />
            </div>
            
            <div className="p-4 border-t-2" style={{ borderColor: "#A32CC4" }}>
              <h3 className="text-lg font-bold text-center text-gray-800">{course.title}</h3>
              
              <div className="mt-3 flex justify-center">
                <button 
                  className="px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: "#A32CC4" }}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
