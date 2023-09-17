const express = require("express");
const router = new express.Router();
const userdb = require("../Model/userSchema");
const bcrypt = require("bcryptjs");
const authentication = require("../Middleware/Authentication");


router.post("/register", async (req, res) => {
          // console.log(req.body);
          try {
                    const {
                              name,
                              email,
                              password,
                              cpassword
                    } = req.body;

                    if (!name || !email || !password || !cpassword) {
                              return res.status(400).json({
                                        msg: "Please enter all fields"
                              });
                    } else {
                              const preUser = await userdb.findOne({
                                        email
                              });

                              if (preUser) {
                                        res.status(201).json({
                                                  status: 201,
                                                  error: "User ALready Exist"
                                        })
                              } else {
                                        const userData = new userdb({
                                                  name,
                                                  email,
                                                  password,
                                                  cpassword
                                        });

                                        const saveData = await userData.save();

                                        res.status(201).json({
                                                  status: 202,
                                                  message: "User Registration done",
                                                  userData: saveData
                                        })
                              }
                    }

          } catch (error) {
                    res.status(422).json({
                              error: "User not register"
                    })
          }
});



router.post("/login", async (req, res) => {
          // console.log(req.body);
          try {
                    const {
                              email,
                              password
                    } = req.body;

                    if (!email || !password) {
                              throw Error("Enter Email and Password");
                    } else {
                              const preUser = await userdb.findOne({
                                        email
                              });

                              if (!preUser) {
                                        res.status(422).json({
                                                  status: 204,
                                                  error: "Email Not Found"
                                        })
                              } else {
                                        const isMatchPassword = await bcrypt.compare(password, preUser.password);

                                        if (!isMatchPassword) {
                                                  res.status(422).json({
                                                            status: 205,
                                                            error: "Password Not Match"
                                                  })
                                        } else {
                                                  // console.log("done");

                                                  const token = await preUser.getSignedToken();
                                                  // console.log(token);


                                                  //generate cookie
                                                  res.cookie("auth_token", token, {
                                                            httpOnly: true, // Ensures the cookie is only accessible on the server
                                                            secure: true, // Ensures the cookie is only sent over HTTPS (in a production environment)
                                                            maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds (adjust as needed)
                                                  });

                                                  const result = {
                                                            preUser,
                                                            token
                                                  };


                                                  res.status(200).json({
                                                            status: 203,
                                                            message: "Login Successful",
                                                            result: result
                                                  });
                                        }
                              }
                    }

          } catch (error) {
                    res.status(422).json({
                              error: "User not login"
                    })
          }
});



//validation user
router.get("/validUser", authentication, async (req, res) => {
          // console.log("done");
          // console.log(req.getData);

          if (req.getData) {
                    // console.log("done");
                    res.status(201).json({
                              status: 205,
                              message: "User Authenticate",
                              getData: req.getData
                    })

          } else {
                    // console.log("no");
                    res.status(422).json({
                              error: "User data not found"
                    })
          }
});



//skill add in databse
router.post("/skill", authentication, async (req, res) => {
          // console.log(req.body);
          try {
                    const {
                              skills
                    } = req.body;
                    // console.log(req.body);
                    // console.log(skill);

                    if (!skills || skills.length === "") {
                              return res.status(422).json({
                                        status: 201,
                                        error: "Skill is empty"
                              })
                    } else {
                              // console.log("find");
                              const user = req.getData;
                              // console.log(user);

                              user.skills.push(...skills);
                              // console.log(pus);

                              const updatedUser = await user.save();
                              // console.log(updatedUser);

                              res.status(200).json({
                                        status: 202,
                                        message: "Skill added successfully",
                                        user: updatedUser,
                              });
                    }

          } catch (error) {
                    res.status(422).json({
                              error: "Skill not add in database"
                    })
          }
});





// Define a route for deleting a skill
router.delete("/deleteskill", authentication, async (req, res) => {
          try {
                    const {
                              skillId
                    } = req.body; // Assuming you pass the skill ID in the request body

                    // console.log(req.body);

                    if (!skillId) {
                              return res.status(400).json({
                                        status: 400,
                                        error: "Skill ID is required",
                              });
                    } else {
                              const user = req.getData;
                              // console.log(user);

                              // const check = user.skills;
                              // console.log(check);


                              user.skills.pull(skillId);

                              // Save the updated user data
                              const updatedUser = await user.save();



                              res.status(200).json({
                                        status: 200,
                                        message: "Skill deleted successfully",
                                        user: updatedUser,
                              });
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Skill deletion failed",
                    });
          }
});





//personalInfo user
router.post("/personalInfo", authentication, async (req, res) => {
          // console.log(req.body);
          try {
                    const {
                              birthday,
                              age,
                              email,
                              course,
                              phone,
                              city
                    } = req.body;

                    if (!birthday || !age || !email || !course || !phone || !city) {
                              return res.status(401).send("Please fill all fields");
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        return res.status(503).json({
                                                  error: "Not Found User"
                                        })
                              } else {
                                        // console.log(user);
                                        //personalInfo

                                        const newPersonalInfo = {
                                                  birthday,
                                                  age,
                                                  email,
                                                  course,
                                                  phone,
                                                  city
                                        };
                                        // console.log(newPersonalInfo);

                                        user.personalInfo = newPersonalInfo;
                                        // user.personalInfoValue.pull(newPersonalInfo);
                                        // console.log(user);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);

                                        res.status(202).json({
                                                  status: 205,
                                                  message: "Updated personalInfo Successfully!",
                                                  updatedUser
                                        })
                              }
                    }

          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error not personal Info found"
                    })
                    console.log(error);
          }
});



//edit education
router.post("/editEducation", authentication, async (req, res) => {
          // console.log(req.body);
          try {
                    const {
                              educationForms
                    } = req.body;

                    if (!educationForms || educationForms.length === 0) {
                              return res.status(400).json({
                                        status: 400,
                                        error: "Education data is required",
                              });
                    } else {
                              const user = req.getData;
                              // console.log(user);

                              if (!user) {
                                        res.status(422).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        // console.log(user);

                                        // user.skills.pull(skillId);
                                        user.education.push(...educationForms);
                                        // console.log(user);

                                        // user.education = educationForms;
                                        // console.log(user);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);


                                        res.status(201).json({
                                                  status: 205,
                                                  message: "Education Added Successfully",
                                                  updatedUser
                                        })
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Education detail not added"
                    })
                    console.log(error);
          }
});



router.delete("/deleteEducationOne", authentication, async (req, res) => {
          // console.log(req.body);
          try {
                    const {
                              educationId
                    } = req.body;
                    // console.log(req.body);

                    if (!educationId) {
                              res.status(422).json({
                                        error: "education id not find"
                              })
                    } else {
                              // console.log(educationId);

                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        // console.log(user);

                                        // Find the education entry with the provided educationId
                                        const educationEntry = user.education.find(
                                                  (education) => education._id.toString() === educationId
                                        );

                                        // console.log(educationEntry);

                                        if (!educationEntry) {
                                                  return res.status(422).send("No Education Found");
                                        } else {


                                                  // Remove the education entry from the user's data
                                                  user.education = user.education.filter(
                                                            (education) => education._id.toString() !== educationId
                                                  );


                                                  // Save the updated user data
                                                  const updatedUser = await user.save();

                                                  // console.log(updatedUser);

                                                  res.status(201).json({
                                                            status: 205,
                                                            message: " Education Deleted Successfully",
                                                            updatedUser
                                                  })
                                        }

                              }
                    }

          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error not delete education"
                    })
          }

});




//editExperience
router.post("/editExperience", authentication, async (req, res) => {
          try {
                    // console.log(req.body);
                    const {
                              experienceForms
                    } = req.body;
                    // console.log(experienceForms);

                    if (!experienceForms || experienceForms.length === 0) {
                              throw new Error('Please enter your experience');
                    } else {
                              const user = req.getData;
                              // console.log(user);

                              if (!user) {
                                        res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        user.experience.push(...experienceForms);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);

                                        res.status(201).json({
                                                  status: 205,
                                                  message: " Experience Updated Successfully ",
                                                  updatedUser
                                        })
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error Experience data not added"
                    })
          }
});



//experience delete
router.delete("/deleteExperience", authentication, async (req, res) => {
          try {
                    // console.log(req.body);
                    const {
                              experienceId
                    } = req.body;

                    if (!experienceId) {
                              res.status(422).json({
                                        error: "Experience id not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        // console.log(user);

                                        const experienceEntry = user.experience.find(
                                                  (experience) => experience._id.toString() === experienceId
                                        );

                                        // console.log(experienceEntry);

                                        if (!experienceEntry) {
                                                  return res.status(403).send("Invalid Id");
                                        } else {

                                                  user.experience = user.experience.filter(
                                                            (experience) => experience._id.toString() !== experienceId
                                                  );

                                                  // console.log(user.experience);

                                                  const updatedUser = await user.save();
                                                  // console.log(updatedUser);

                                                  res.status(201).json({
                                                            status: 205,
                                                            message: "Experience Deleted successfully!",
                                                            updatedUser
                                                  })
                                        }
                              }
                    }

          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error Not delete experience data"
                    })
          }
})




//service add
router.post("/editService", authentication, async (req, res) => {
          try {
                    // console.log(req.body);
                    const {
                              service
                    } = req.body;

                    if (!service) {
                              return res.status(406).send('Please fill all fields');
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "Not found user"
                                        })
                              } else {
                                        // console.log(user);

                                        user.service.push(...service);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);

                                        res.status(201).json({
                                                  status: 205,
                                                  message: "Services Added Successfully!",
                                                  updatedUser
                                        })
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server error not add service  "
                    })
          }
});



//delete service
router.delete("/deleteService", authentication, async (req, res) => {
          try {
                    // console.log(req.body);

                    const {
                              serviceId
                    } = req.body;

                    if (!serviceId) {
                              res.status(422).json({
                                        error: "Service id not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        return res.status(403).json("not found user");
                              } else {
                                        // console.log(user);

                                        const serviceEntry = user.service.find((service) =>
                                                  service._id.toString() === serviceId
                                        );

                                        // console.log(serviceEntry);

                                        if (!serviceEntry) {
                                                  return res.status(409).json('service id not found');
                                        } else {
                                                  // console.log(serviceEntry);

                                                  user.service = user.service.filter((service) => service._id.toString() !== serviceId);

                                                  const updatedUser = await user.save();
                                                  // console.log(updatedUser);

                                                  res.status(201).json({
                                                            status: 205,
                                                            message: "service deleted successfully ",
                                                            updatedUser
                                                  })
                                        }

                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server error not delete service"
                    })
          }
});



//edit project
router.post("/editProject", authentication, async (req, res) => {
          try {
                    // console.log(req.body);
                    const {
                              project
                    } = req.body;

                    if (!project) {
                              throw new Error("please enter the data");
                    } else {
                              // console.log(project);

                              const user = req.getData;

                              if (!user) {
                                        return res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        // console.log(user);

                                        user.project.push(...project);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);

                                        res.status(201).json({
                                                  status: 205,
                                                  message: "project added sucessfully",
                                                  updatedUser
                                        })
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error Project not add"
                    })
          }
})



//delete project
router.delete("/deleteProject", authentication, async (req, res) => {
          try {
                    // console.log(req.body);

                    const {
                              projectId
                    } = req.body;

                    if (!projectId) {
                              res.status(422).json({
                                        error: "Project id not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        // console.log(user);

                                        const entryProject = user.project.find((project) => project._id.toString() === projectId);

                                        if (!entryProject) {
                                                  res.status(422).json({
                                                            error: "No entry for this project"
                                                  })
                                        } else {
                                                  // console.log(entryProject);

                                                  user.project = user.project.filter((project) => project._id.toString() !== projectId);

                                                  const updatedUser = await user.save();
                                                  // console.log(updatedUser);

                                                  res.status(201).json({
                                                            status: 205,
                                                            message: "project deleted successfully",
                                                            updatedUser
                                                  })
                                        }
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error not delete project"
                    })
          }
});




//edit certificate
router.post("/editCertificate", authentication, async (req, res) => {
          // console.log(req.body);
          try {
                    const {
                              certificate
                    } = req.body;

                    if (!certificate) {
                              res.status(422).json({
                                        error: "Certificate not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        user.certificate.push(...certificate);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);

                                        res.status(201).json({
                                                  status: 205,
                                                  message: "Certificates added to the profile Successfully!",
                                                  updatedUser
                                        })
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal server error not add Certificate"
                    })
          }
});



//delete certificate
router.delete("/deleteCertificate", authentication, async (req, res) => {
          try {
                    // console.log(req.body);


                    const {
                              certificateId
                    } = req.body;

                    if (!certificateId) {
                              res.status(422).json({
                                        error: "certificat id not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "user not found"
                                        })
                              } else {
                                        const entryField = user.certificate.find((certificate) => certificate._id.toString() === certificateId);

                                        if (!entryField) {
                                                  res.status(422).json({
                                                            error: "entry field not found"
                                                  })
                                        } else {
                                                  user.certificate = user.certificate.filter((certificate) => certificate._id.toString() !== certificateId);

                                                  const updatedUser = await user.save();
                                                  // console.log(updatedUser);

                                                  res.status(201).json({
                                                            status: 205,
                                                            message: "Certificate successfully delete",
                                                            updatedUser
                                                  })
                                        }
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server error not delete certificate"
                    })
          }
})



//editContact
router.post("/editContact", authentication, async (req, res) => {
          try {
                    // console.log(req.body);

                    const {
                              contact
                    } = req.body;

                    if (!contact) {
                              res.status(422).json({
                                        error: "Not found contact"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        user.contact.push(...contact);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);

                                        res.status(201).json({
                                                  status: 205,
                                                  message: "Contact added successfully done",
                                                  updatedUser
                                        })
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error not add contact"
                    })
          }
});


//deleteContact
router.delete("/deleteContact", authentication, async (req, res) => {
          try {
                    // console.log(req.body);

                    const {
                              contactId
                    } = req.body;

                    if (!contactId) {
                              res.status(422).json({
                                        error: "Contect id not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "User not found"
                                        })
                              } else {
                                        const entryField = user.contact.find((contact) => contact._id.toString() === contactId);

                                        if (!entryField) {
                                                  res.status(422).json({
                                                            error: "entryField not found"
                                                  })
                                        } else {
                                                  // console.log(entryField);

                                                  user.contact = user.contact.filter((contact) => contact._id.toString() !== contactId);

                                                  const updatedUser = await user.save();

                                                  res.status(201).json({
                                                            status: 205,
                                                            message: "Contact delete successfully done",
                                                            updatedUser
                                                  })
                                        }
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error not delete contact"
                    })
          }
});



// editPhoto
router.post("/editPhoto", authentication, async (req, res) => {
          try {
                    // console.log(req.body);

                    const {
                              photo
                    } = req.body;

                    if (!photo) {
                              res.status(422).json({
                                        error: "Photo not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "user not found"
                                        })
                              } else {
                                        user.photo.push(photo);

                                        const updatedUser = await user.save();
                                        // console.log(updatedUser);

                                        res.status(201).json({
                                                  status: 205,
                                                  message: "Photo added successfully",
                                                  updatedUser
                                        })
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal Server Error not add photo"
                    })
          }
});


//deletePhoto
router.delete("/deletePhoto", authentication, async (req, res) => {
          try {
                    // console.log(req.body);

                    const {
                              photoId
                    } = req.body;

                    if (!photoId) {
                              res.status(422).json({
                                        error: "photo id not found"
                              })
                    } else {
                              const user = req.getData;

                              if (!user) {
                                        res.status(201).json({
                                                  error: "user not found"
                                        })
                              } else {
                                        const emptyFields = user.photo.find((photo) => photo._id.toString() === photoId);

                                        if (!emptyFields) {
                                                  res.status(422).json({
                                                            error: "empty fields not found"
                                                  })
                                        } else {
                                                  user.photo = user.photo.filter((photo) => photo._id.toString() !== photoId);

                                                  const updatedUser = await user.save();

                                                  res.status(201).json({
                                                            status: 205,
                                                            message: "photo delete successfully done",
                                                            updatedUser
                                                  })
                                        }
                              }
                    }
          } catch (error) {
                    res.status(422).json({
                              error: "Internal error not delete photo"
                    })
          }
})




module.exports = router;