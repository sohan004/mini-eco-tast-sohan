import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";
import {
  useGetLogUserInfoQuery,
  useLogOutMutation,
  useMyOrderQuery,
} from "../../redux/api/privateQuery";
import dayjs from "dayjs";
import { IoLogOutSharp } from "react-icons/io5";
import { Link } from "react-router";

const ProfilePage = () => {
  const { data: userInfo, isLoading } = useGetLogUserInfoQuery();
  const { data: orders } = useMyOrderQuery();
  const [out] = useLogOutMutation();

  const logOut = async () => {
    await out();
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 pb-6">
          <h1 className="text-xl font-bold text-gray-800 md:text-3xl">
            My Profile
          </h1>
          <p className="text-gray-600">Welcome back, {userInfo?.user?.name}!</p>
        </div>
      </header>

      <main className="container mx-auto bg-white px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Customer Details Section */}
          <div className="w-full lg:w-1/3">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
              {/* Profile Header */}
              <div className="bg-gray-300 p-6 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-400 text-4xl text-white">
                  <FaUser />
                </div>
                <h2 className="text-xl font-bold uppercase text-gray-700">
                  {userInfo?.user?.name}
                </h2>
                <p className="text-gray-500">
                  Member since{" "}
                  {dayjs(userInfo?.user?.createdAt).format("DD MMM, YYYY")}
                </p>
                <p
                  onClick={logOut}
                  className="mt-2 flex cursor-pointer items-center justify-center gap-2 text-lg font-medium text-red-600"
                >
                  {" "}
                  Log out
                  <IoLogOutSharp />
                </p>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>

                  <div className="mb-4 flex items-start">
                    <div className="mr-4 mt-1 text-orange-600">
                      <FaEnvelope />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-800">{userInfo?.user?.email}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex items-start">
                    <div className="mr-4 mt-1 text-orange-600">
                      <FaPhone />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-800">{userInfo?.user?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-4 mt-1 text-orange-600">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-gray-800">{userInfo?.user?.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="w-full lg:w-2/3">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
              <div className="border-b border-gray-200 p-6">
                <h2 className="flex items-center text-xl font-bold text-gray-800">
                  <FaShoppingBag className="mr-3 text-orange-600" /> Order
                  History
                </h2>
              </div>

              <div className="p-6">
                {orders?.data?.length > 0 ? (
                  <div className="space-y-6">
                    {orders?.data?.map((order, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4 transition duration-200 hover:shadow-md"
                      >
                        <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between">
                          <h3 className="font-semibold text-gray-800">
                            #{order.id}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="mr-2 text-orange-600" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaShoppingBag className="mr-2 text-orange-600" />
                            {order.quantity}{" "}
                            {order.quantity > 1 ? "items" : "item"}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaDollarSign className="mr-2 text-orange-600" />
                            BDT {order.totalAmount?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FaShoppingBag className="mx-auto mb-4 text-4xl text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700">
                      No orders yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Your order history will appear here
                    </p>
                    <Link
                      to="/"
                      className="mt-6 rounded-md bg-orange-600 px-6 py-2 text-white transition duration-300 hover:bg-orange-700"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
