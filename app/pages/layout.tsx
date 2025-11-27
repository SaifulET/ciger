
import Navbar from "@/Components/Navbar/Navbar";
import Sidebar from "@/Components/Sidebar/Sidebar";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div >
      <div
       
      >
        <Navbar/>

        <div className="bg-[#F5F5F5] p-[16px] md:p-[32px] grid  grid-cols-[2fr_6fr] ">
            <div className=""><Sidebar/></div>
           {children} 
        </div>
        
      </div>
    </div>
  );
}
