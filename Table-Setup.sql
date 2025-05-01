-- Create the database
CREATE DATABASE study_group_finder;
USE study_group_finder;

-- Users Table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  course_time VARCHAR(100)
);

-- Study Groups Table
CREATE TABLE study_groups (
  group_id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(100) NOT NULL,
  group_type VARCHAR(50),
  max_members INT,
  meeting_time DATETIME,
  group_course_id INT,
  location VARCHAR(50),
  FOREIGN KEY (group_course_id) REFERENCES courses(course_id)
);

-- Group Members Table (Many-to-Many between Users and Study Groups)
CREATE TABLE group_members (
  study_group_id INT,
  member_id INT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50),
  status VARCHAR(50),
  custom_name VARCHAR(100),
  PRIMARY KEY (study_group_id, member_id),
  FOREIGN KEY (study_group_id) REFERENCES study_groups(group_id),
  FOREIGN KEY (member_id) REFERENCES users(user_id)
);

-- Messages Table
CREATE TABLE messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  receiving_group_id INT,
  sender_id INT,
  FOREIGN KEY (receiving_group_id) REFERENCES study_groups(group_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id)
);
-- Reports Table
CREATE TABLE reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100),
  status VARCHAR(50),
  written_statement TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reporter_id INT,
  reported_user_id INT,
  FOREIGN KEY (reporter_id) REFERENCES users(user_id),
  FOREIGN KEY (reported_user_id) REFERENCES users(user_id)
);