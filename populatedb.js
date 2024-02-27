#! /usr/bin/env node

console.log(
  'This script populates some test posts and comments to database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Post = require("./models/post");
const Comment = require("./models/comment");

const posts = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createPosts();
  await createComments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function postCreate(index, title, text, timestamp, published) {
  const postdetail = {
    title: title,
    text: text,
    timestamp: timestamp,
    published: published,
  };
  const post = new Post(postdetail);

  await post.save();
  posts[index] = post;
  console.log(`Added post: ${title} ${timestamp}`);
}

async function commentCreate(index, post, text, username, timestamp) {
  const commentdetail = {
    post: post,
    text: text,
    username: username,
    timestamp: timestamp,
  };

  const comment = new Comment(commentdetail);
  await comment.save();
  comment[index] = comment;
  console.log(`Added comment by ${username} at ${timestamp}`);
}

async function createPosts() {
  console.log("Adding posts");
  await Promise.all([
    postCreate(
      0,
      "Learning Express.js",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris varius non sapien blandit tincidunt. Cras sed ligula metus. Maecenas et mauris sit amet diam venenatis luctus non eget lacus. Nullam dictum ultricies dignissim. Praesent lorem ante, facilisis ac dolor rutrum, laoreet ullamcorper nisi. Proin laoreet malesuada mi eget ullamcorper. In consequat neque at pharetra aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at lorem tellus. Nunc feugiat sagittis mi, sit amet faucibus odio. Morbi imperdiet sed metus dignissim lacinia.",
      Date.now(),
      false,
      []
    ),
    postCreate(
      1,
      "Using Pug Template Engine",
      "Aenean elementum pharetra mauris vitae facilisis. In sem est, sollicitudin auctor odio a, elementum varius metus. Ut vulputate pulvinar feugiat. Vestibulum pretium felis sed risus convallis, at venenatis turpis elementum. Curabitur vitae mi ut tortor vehicula interdum. Nam tempor libero eu ante placerat dignissim. Nunc consequat mattis libero tristique lacinia. Cras ullamcorper non augue sed mollis. Duis id arcu viverra, luctus velit vitae, mollis orci. Nullam sollicitudin imperdiet magna, et laoreet urna mattis a. Cras consectetur a ante pulvinar cursus. Quisque congue aliquet placerat.",
      Date.now(),
      false,
      []
    ),
    postCreate(
      2,
      "MongoDB and Mongoose",
      "Aenean sollicitudin neque eget nibh fermentum tincidunt. Praesent eleifend odio eros, sit amet sodales erat ultrices lobortis. Mauris risus tortor, efficitur id augue vitae, sodales condimentum nunc. Integer et imperdiet nisi. Maecenas imperdiet enim eu dui tempus porta. Nam in mollis nibh. Duis egestas eget urna vitae rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris suscipit nunc pretium venenatis dictum. Fusce quis lorem sem. Phasellus eu nisl sed velit commodo pulvinar non eu nunc. Duis quis nisl nec purus euismod dapibus. Pellentesque sit amet urna luctus lectus mattis ornare nec eget leo. Cras ultricies ante libero, nec rhoncus sem faucibus gravida. Proin at eros ut mauris pellentesque volutpat.",
      Date.now(),
      true,
      []
    ),
    postCreate(
      3,
      "Building an API",
      "Pellentesque fermentum vel felis eu condimentum. Morbi gravida purus sed nisl elementum, vitae tincidunt lacus dictum. Phasellus lorem arcu, venenatis et nisi sed, scelerisque elementum nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer vehicula nulla at sem feugiat aliquet. Sed ultrices nisl nulla, et pharetra neque fermentum in. Morbi ut quam id ante rutrum faucibus non non risus. Donec malesuada enim sed accumsan suscipit. Nulla vel dolor eros. Etiam euismod dolor vel consectetur ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      Date.now(),
      true,
      []
    ),
    postCreate(
      4,
      "Express Security and Deployment",
      "Donec rutrum sodales suscipit. Mauris sit amet ante erat. Donec posuere tempor felis eget molestie. Aliquam pellentesque eget risus nec pulvinar. Etiam dignissim fringilla felis non luctus. Cras felis augue, mollis ac viverra vel, pulvinar quis ex. Aenean nunc turpis, sagittis at aliquet a, tristique ut lacus. Nunc et tempor quam. Cras et nunc sit amet leo suscipit condimentum ac eu dui. Donec sed arcu in justo vestibulum rutrum. Donec dictum magna sit amet orci efficitur aliquam non a tellus. Fusce id diam at eros fermentum dignissim eu id ante. Aliquam tincidunt vel arcu quis efficitur.",
      Date.now(),
      true,
      []
    ),
  ]);
}

async function createComments() {
  console.log("Adding Comments");
  await Promise.all([
    commentCreate(
      0,
      posts[0],
      "Vestibulum elementum purus ac congue elementum. Cras leo odio, ultrices et feugiat vel, porta sit amet arcu. Ut sed sapien orci. Nulla facilisi. Sed tristique et felis sit amet rutrum. Nunc auctor sagittis sodales. Duis vulputate tellus pretium, volutpat nunc id, gravida justo. Ut id purus lorem. Nulla ullamcorper ut est non tempor. Vestibulum arcu mi, viverra et maximus nec, aliquam at elit. Proin facilisis vestibulum laoreet.",
      "LearningToCode88",
      Date.now()
    ),
    commentCreate(
      1,
      posts[0],
      "Proin finibus in tortor sodales semper. Fusce placerat fermentum quam, ac sagittis urna. Sed enim tortor, accumsan vitae magna in, venenatis egestas lectus. Proin velit est, convallis vitae euismod id, tempor ac est. Mauris odio est, dapibus sed consequat quis, aliquam ut justo. Praesent gravida in mauris vitae condimentum. Aliquam magna mi, iaculis eu est vitae, congue sodales mi. Nunc porttitor maximus felis sit amet elementum. Vestibulum nec porttitor libero. Mauris placerat dolor pellentesque aliquam sodales. Cras luctus nulla varius, posuere erat dictum, vulputate ipsum. Nullam et quam non quam tristique malesuada sit amet at diam. Maecenas ac velit porttitor, mattis urna non, aliquam nunc. Phasellus eget nibh porttitor, feugiat magna faucibus, euismod ex. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc gravida, arcu nec pulvinar congue, velit lectus vestibulum enim, sed cursus nisl massa et urna.",
      "dave@hotmail.com",
      Date.now()
    ),
    commentCreate(
      2,
      posts[1],
      "Aenean posuere lacus nec erat lobortis, nec congue mi vestibulum. Fusce ac aliquet augue, ut luctus mauris. Sed facilisis non mi vitae pretium. Cras non pulvinar eros. Nam id ornare justo. Phasellus aliquet, eros tempor pulvinar efficitur, neque ipsum elementum ligula, id dictum justo massa quis diam. Donec dignissim lacus magna, eget pretium lacus luctus a. Nunc at scelerisque erat. Duis eleifend velit at posuere lacinia. Maecenas a tortor sit amet lectus faucibus molestie. Ut tincidunt tincidunt arcu, at posuere ligula commodo ut.",
      "cheetoSantino",
      Date.now()
    ),
    commentCreate(
      3,
      posts[1],
      "Mauris nulla ipsum, ullamcorper ut pharetra semper, semper et dolor. Praesent quis rhoncus justo. Donec scelerisque maximus nisi, vitae condimentum dolor tempor ut. Proin malesuada cursus sagittis. Praesent blandit suscipit mauris a accumsan. Ut ullamcorper purus et ultricies faucibus. Etiam iaculis feugiat aliquet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras suscipit varius felis, at faucibus quam vestibulum a. Nunc luctus ligula at felis consequat, in porta ante lacinia. Donec ac pretium nunc, ac pulvinar ante. Praesent eu risus at tellus posuere malesuada a in turpis. In sapien tellus, venenatis in velit ut, fermentum ullamcorper quam. Vivamus sagittis consequat massa id pulvinar.",
      "DrBuckles",
      Date.now()
    ),
    commentCreate(
      4,
      posts[2],
      "Phasellus ac sem felis. Quisque vitae tempor justo. Cras quis sapien aliquam, sagittis risus vitae, mollis nisl. Aliquam sed convallis nisl. Vestibulum velit ligula, pellentesque vel iaculis nec, aliquam id mauris. Morbi non rhoncus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at magna molestie, tempus diam vitae, tempus eros. Praesent scelerisque risus vel metus aliquam congue. Integer eget tempor lacus. Praesent porta, ante et finibus molestie, urna odio tristique felis, vitae laoreet tellus neque sit amet est. Suspendisse gravida arcu quis leo vehicula ultricies. Sed tristique neque ex, id ultrices est porta nec.",
      "Gemma Smith",
      Date.now()
    ),
    commentCreate(
      5,
      posts[3],
      "Nulla arcu diam, porta quis laoreet eu, viverra in enim. Phasellus suscipit nunc ullamcorper sem aliquet accumsan. Cras ante mauris, pellentesque eget mauris a, convallis pretium orci. Donec finibus tristique pharetra. Phasellus pellentesque velit sit amet iaculis pellentesque. Morbi condimentum augue magna, quis placerat metus lacinia id. Fusce vulputate semper neque ac efficitur. Nam ornare risus vel nisi efficitur vestibulum.",
      "dave.hotmail.com",
      Date.now()
    ),
    commentCreate(
      6,
      posts[3],
      "Suspendisse consectetur, elit sit amet faucibus sagittis, justo erat mattis est, a accumsan nisi nunc eget turpis. Sed sed justo vitae purus lacinia auctor. Morbi vitae arcu vestibulum, efficitur diam scelerisque, sollicitudin turpis. Pellentesque ut elit sit amet nisl elementum feugiat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi. Ut neque arcu, cursus ac nisl non, pretium faucibus mauris. Nam quis quam nunc.",
      "cheetoSantino",
      Date.now()
    ),
  ]);
}
