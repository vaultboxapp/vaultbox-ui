import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNames = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/search": "Search",
  "/video": "Video Meeting",
  "/channels": "Channels",
  "/messages": "Messages",
  "/settings": "Settings",
}

const Layout = () => {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  const getBreadcrumbs = () => {
    const breadcrumbs = []
    let currentPath = ""

    breadcrumbs.push({
      name: "Home",
      path: "/",
      isLast: pathnames.length === 0,
    })

    pathnames.forEach((name, index) => {
      currentPath += `/${name}`
      breadcrumbs.push({
        name: routeNames[currentPath] || name,
        path: currentPath,
        isLast: index === pathnames.length - 1,
      })
    })

    return breadcrumbs
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center h-16 w-screen px-6 border-b shrink-0">
          <SidebarTrigger className="mr-4" />
          <div className="flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.path}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {breadcrumb.isLast ? (
                        <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={breadcrumb.path}>{breadcrumb.name}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1  overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
