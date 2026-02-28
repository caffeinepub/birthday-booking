import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

actor {
  public type Package = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    features : [Text];
    maxGuests : Nat;
  };

  public type Booking = {
    id : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    partyDate : Text;
    numberOfGuests : Nat;
    packageId : Text;
    specialRequests : Text;
    status : Status;
    createdAt : Int;
  };

  public type Status = {
    #pending;
    #confirmed;
    #cancelled;
  };

  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      if (booking1.createdAt < booking2.createdAt) {
        #less;
      } else if (booking1.createdAt > booking2.createdAt) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  let packages = Map.empty<Text, Package>();
  let bookings = Map.empty<Text, Booking>();
  var bookingCounter = 0;

  let initialPackages : [Package] = [
    {
      id = "basic";
      name = "Basic Party";
      description = "Up to 20 guests, basic decorations, birthday cake, 2-hour venue";
      price = 199;
      features = ["Basic decorations", "Birthday cake", "2-hour venue"];
      maxGuests = 20;
    },
    {
      id = "standard";
      name = "Standard Party";
      description = "Up to 40 guests, themed decorations, birthday cake, catering, 3-hour venue, photography";
      price = 399;
      features = ["Themed decorations", "Birthday cake", "Catering", "3-hour venue", "Photography"];
      maxGuests = 40;
    },
    {
      id = "premium";
      name = "Premium Party";
      description = "Up to 80 guests, luxury decorations, custom cake, full catering, 5-hour venue, photography, DJ, party favors";
      price = 699;
      features = ["Luxury decorations", "Custom cake", "Full catering", "5-hour venue", "Photography", "DJ", "Party favors"];
      maxGuests = 80;
    },
  ];

  public shared ({ caller }) func init() : async () {
    for (pkg in initialPackages.values()) {
      packages.add(pkg.id, pkg);
    };
  };

  public query ({ caller }) func getPackages() : async [Package] {
    packages.values().toArray();
  };

  public shared ({ caller }) func createBooking(
    customerName : Text,
    email : Text,
    phone : Text,
    partyDate : Text,
    numberOfGuests : Nat,
    packageId : Text,
    specialRequests : Text,
  ) : async Booking {
    if (customerName == "" or email == "") {
      Runtime.trap("Customer name and email are required");
    };

    switch (packages.get(packageId)) {
      case (null) { Runtime.trap("Selected package does not exist") };
      case (?package) {
        if (numberOfGuests > package.maxGuests) {
          Runtime.trap("Number of guests exceeds package limit");
        };

        let bookingId = (Time.now() / 1_000_000_000).toText() # "-" # bookingCounter.toText();
        bookingCounter += 1;

        let newBooking : Booking = {
          id = bookingId;
          customerName;
          email;
          phone;
          partyDate;
          numberOfGuests;
          packageId;
          specialRequests;
          status = #pending;
          createdAt = Time.now();
        };

        bookings.add(bookingId, newBooking);
        newBooking;
      };
    };
  };

  public query ({ caller }) func getBooking(id : Text) : async Booking {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    bookings.values().toArray();
  };

  public shared ({ caller }) func updateBookingStatus(id : Text, status : Status) : async Booking {
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = { booking with status };
        bookings.add(id, updatedBooking);
        updatedBooking;
      };
    };
  };

  public query ({ caller }) func getBookingsByEmail(email : Text) : async [Booking] {
    let filteredBookings = bookings.values().toArray().filter(
      func(b) { b.email == email }
    );
    filteredBookings.sort();
  };
};
