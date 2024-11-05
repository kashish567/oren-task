"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <Provider store={store}>
      <div className="text-black">{children}</div>
    </Provider>
  );
}
