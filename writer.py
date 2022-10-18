"""
Used to automatically code the html lines for a resume
"""
def capitalize(s):
    return " ".join((x[0].upper() + x[1:].lower() for x in s.split()))


def experience(pos = None, firm = None, date = None):\
    #Get all the inputs
    if not pos:
        pos = capitalize(input("Enter the Position: "))
        firm = capitalize(input("Enter the Firm: "))
        date = capitalize(input("Enter the Date Range (ex:'May 2021 - August 2021'): "))
        bullet_points = []
        count = 0
        while True:
            count += 1
            b = input(f"Enter Bullet Point {count}: ")
            if not b or b == " ":
                break
            elif count > 10:
                raise RuntimeError("Count Reached 10")
            else:
                bullet_points.append("- " + b +"<br>")
        bullet_points = "\n".join(bullet_points)


    pos = capitalize(pos)


    lines = [
        f"<p>",
        f"\t<br>",
        f"\t<span style='float: left'><b>{pos}, {firm}</b></span>",
        f"\t<span style='float: right'><b>{date}</b></span>",

        f"</p>",
        f"<br>",
        f"{bullet_points}",
        f"<p></p>"
    ]
    string = ""
    for line in lines:
        string += line + "\n"

    return string

if __name__ =="__main__":
    def main():
        filename = 'out.html'
        try:
            with open(filename,mode = "a") as f:
                f.writelines(experience())
        except FileNotFoundError:
            try:
                with open(filename,mode = "w") as f:
                    f.writelines(experience(),)
            except:
                f.close()
        except:
            f.close()
    main()
